from django.http import JsonResponse
from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_http_methods

from .models import FAQ, Policy, Booking, Inquiry, Product, Review, Service, SiteSettings


CATEGORY_INFO = {
    Product.Category.PHONE: {
        'title': 'Phones',
        'description': 'Popular smartphones with strong battery life, camera quality, and dependable performance.',
    },
    Product.Category.LAPTOP: {
        'title': 'Laptops',
        'description': 'Professional and student laptops for office tasks, online learning, and creative work.',
    },
    Product.Category.TABLET: {
        'title': 'Tablets',
        'description': 'Portable devices for learning, travel, and presentations.',
    },
    Product.Category.ACCESSORY: {
        'title': 'Accessories',
        'description': 'Chargers, earbuds, cables, and essential extras that keep devices powered and protected.',
    },
    Product.Category.PART: {
        'title': 'Spare Parts',
        'description': 'Quality replacement parts for upgrades, repairs, and better device performance.',
    },
}


def website_home(request):
    settings_obj = SiteSettings.objects.filter(is_active=True).first()
    services = Service.objects.filter(is_active=True).order_by('name')
    reviews = Review.objects.filter(is_published=True)[:6]
    faqs = FAQ.objects.filter(is_active=True).order_by('display_order', 'question')
    policies = Policy.objects.filter(is_active=True).order_by('policy_type', 'title')
    grouped_products = []

    for category, info in CATEGORY_INFO.items():
        products = Product.objects.filter(is_active=True, category=category).prefetch_related('specifications').order_by('-is_featured', 'name')
        if products.exists():
            grouped_products.append({
                'key': category,
                'title': info['title'],
                'description': info['description'],
                'products': products,
            })

    context = {
        'settings_obj': settings_obj,
        'services': services,
        'reviews': reviews,
        'faqs': faqs,
        'policies': policies,
        'grouped_products': grouped_products,
        'category_items': [
            {'key': key, 'title': value['title'], 'description': value['description']}
            for key, value in CATEGORY_INFO.items()
        ],
    }
    return render(request, 'website/home.html', context)


@staff_member_required
def dashboard_home(request):
    context = {
        'settings_obj': SiteSettings.objects.filter(is_active=True).first(),
        'product_count': Product.objects.filter(is_active=True).count(),
        'service_count': Service.objects.filter(is_active=True).count(),
        'review_count': Review.objects.filter(is_published=True).count(),
        'booking_count': Booking.objects.count(),
        'inquiry_count': Inquiry.objects.count(),
    }
    return render(request, 'website/dashboard_home.html', context)


PUBLIC_ORIGINS = {'http://localhost:8000', 'http://127.0.0.1:8000'}


def _api_response(request, data, status=200):
    response = JsonResponse(data, status=status)
    origin = request.headers.get('Origin')
    if origin in PUBLIC_ORIGINS:
        response['Access-Control-Allow-Origin'] = origin
        response['Vary'] = 'Origin'
    return response


@require_GET
def public_state(request):
    settings_obj = SiteSettings.objects.filter(is_active=True).first()
    business = {}
    headings = {}
    if settings_obj:
        business = {
            'companyName': settings_obj.company_name,
            'tagline': settings_obj.tagline,
            'phone': settings_obj.phone,
            'email': settings_obj.email,
            'address': settings_obj.address,
            'hours': settings_obj.business_hours,
            'whatsapp': settings_obj.whatsapp_number,
            'facebook': settings_obj.facebook_url,
            'instagram': settings_obj.instagram_url,
            'mapQuery': settings_obj.google_maps_query,
        }
        headings = {
            'homepageHeadline': settings_obj.homepage_headline,
            'homepageDescription': settings_obj.homepage_description,
            'servicesHeading': settings_obj.services_heading,
            'servicesDescription': settings_obj.services_description,
            'shopHeading': settings_obj.shop_heading,
            'shopDescription': settings_obj.shop_description,
            'aboutHeading': settings_obj.about_heading,
            'aboutDescription': settings_obj.about_description,
            'reviewsHeading': settings_obj.reviews_heading,
            'reviewsDescription': settings_obj.reviews_description,
            'faqsHeading': settings_obj.faqs_heading,
            'faqsDescription': settings_obj.faqs_description,
            'policiesHeading': settings_obj.policies_heading,
            'policiesDescription': settings_obj.policies_description,
            'contactHeading': settings_obj.contact_heading,
            'contactDescription': settings_obj.contact_description,
        }

    products = []
    for product in Product.objects.filter(is_active=True).prefetch_related('specifications'):
        image = product.image.url if product.image else product.image_url
        if image and image.startswith('/'):
            image = request.build_absolute_uri(image)
        specs = list(product.specifications.values_list('label', 'value'))
        if not specs and product.specs:
            specs = [('', line.strip()) for line in product.specs.splitlines() if line.strip()]
        products.append({
            'id': str(product.pk),
            'name': product.name,
            'category': product.category,
            'price': float(product.price),
            'badge': product.badge,
            'description': product.description,
            'specs': [f'{label}: {value}' if label else value for label, value in specs],
            'image': image or '',
            'active': True,
        })

    services = []
    for service in Service.objects.filter(is_active=True).order_by('name'):
        image = service.image.url if service.image else ''
        if image:
            image = request.build_absolute_uri(image)
        services.append({
            'name': service.name,
            'description': service.description,
            'startingPrice': str(service.starting_price or ''),
            'turnaroundTime': service.turnaround_time,
            'image': image,
        })

    reviews = [
        {
            'reviewer': review.reviewer_name,
            'rating': f'{review.rating} Stars',
            'comment': review.comment,
        }
        for review in Review.objects.filter(is_published=True)[:6]
    ]
    faqs = list(FAQ.objects.filter(is_active=True).values('question', 'answer'))
    policies = list(Policy.objects.filter(is_active=True).values('title', 'content', 'policy_type'))
    return _api_response(request, {
        'business': business,
        'headings': headings,
        'products': products,
        'services': services,
        'reviews': reviews,
        'faqs': faqs,
        'policies': policies,
    })


@csrf_exempt
@require_http_methods(['POST', 'OPTIONS'])
def public_submission(request):
    origin = request.headers.get('Origin')
    if origin and origin not in PUBLIC_ORIGINS:
        return JsonResponse({'ok': False, 'error': 'Origin not allowed.'}, status=403)
    if request.method == 'OPTIONS':
        response = _api_response(request, {})
        response['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type'
        return response

    kind = request.POST.get('type', '')
    try:
        if kind == 'booking':
            Booking.objects.create(
                customer_name=request.POST.get('name', '').strip(),
                phone=request.POST.get('phone', '').strip(),
                device_type=request.POST.get('device', '').strip(),
                preferred_date=request.POST.get('date') or None,
                preferred_time=request.POST.get('time') or None,
                issue_description=request.POST.get('issue', '').strip(),
                channel='website',
            )
        elif kind == 'review':
            rating = int(''.join(filter(str.isdigit, request.POST.get('rating', '5'))) or 5)
            Review.objects.create(
                reviewer_name=request.POST.get('reviewer', '').strip(),
                rating=max(1, min(rating, 5)),
                comment=request.POST.get('comment', '').strip(),
            )
        elif kind == 'inquiry':
            Inquiry.objects.create(
                customer_name=request.POST.get('name', '').strip(),
                email=request.POST.get('email', '').strip(),
                subject='Website inquiry',
                message=request.POST.get('message', '').strip(),
                preferred_channel='website',
            )
        else:
            return _api_response(request, {'ok': False, 'error': 'Unknown submission type.'}, status=400)
    except (TypeError, ValueError):
        return _api_response(request, {'ok': False, 'error': 'Please check the submitted details.'}, status=400)

    return _api_response(request, {'ok': True}, status=201)
