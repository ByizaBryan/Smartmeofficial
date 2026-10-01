from django.contrib.admin import AdminSite
from django.urls import reverse
from django.contrib.auth.models import User

from .models import Booking, FAQ, Inquiry, Policy, Product, Review, Service, SiteSettings


class SmartMeAdminSite(AdminSite):
    site_header = "SmartMe Operations Dashboard"
    site_title = "SmartMe Admin"
    index_title = "Manage the whole SmartMe project"

    def each_context(self, request):
        context = super().each_context(request)
        context.update(
            {
                "operations_cards": [
                    {"label": "Products", "count": Product.objects.count(), "url": reverse("admin:website_product_changelist")},
                    {"label": "Services", "count": Service.objects.count(), "url": reverse("admin:website_service_changelist")},
                    {"label": "Bookings", "count": Booking.objects.count(), "url": reverse("admin:website_booking_changelist")},
                    {"label": "Inquiries", "count": Inquiry.objects.count(), "url": reverse("admin:website_inquiry_changelist")},
                    {"label": "Reviews", "count": Review.objects.count(), "url": reverse("admin:website_review_changelist")},
                    {"label": "Site Settings", "count": SiteSettings.objects.count(), "url": reverse("admin:website_sitesettings_changelist")},
                    {"label": "Accounts", "count": User.objects.count(), "url": reverse("admin:auth_user_changelist")},
                    {"label": "FAQs", "count": FAQ.objects.count(), "url": reverse("admin:website_faq_changelist")},
                    {"label": "Policies", "count": Policy.objects.count(), "url": reverse("admin:website_policy_changelist")},
                ]
            }
        )
        return context


smartme_admin_site = SmartMeAdminSite(name="smartme_admin")
