from django.core.management.base import BaseCommand
from django.utils.text import slugify

from website.models import FAQ, Policy, Product, ProductSpecification, Review, Service, SiteSettings


class Command(BaseCommand):
    help = "Seed SmartMe demo data for the Django admin dashboard."

    def handle(self, *args, **options):
        SiteSettings.objects.update_or_create(
            company_name="SmartMe Technology Ltd",
            defaults={
                "tagline": "Your Trusted Partner for Electronics Sales and Repairs.",
                "phone": "+250 789 295 618",
                "email": "byizab27@smartmetechnology.com",
                "address": "KN 74 St, Kigali, Rwanda",
                "business_hours": "Mon-Sat, 08:00-18:00",
                "whatsapp_number": "250789295618",
                "facebook_url": "https://facebook.com",
                "instagram_url": "https://instagram.com",
                "google_maps_query": "KN 74 St Kigali Rwanda",
                "homepage_headline": "Your Trusted Partner for Electronics Sales and Repairs.",
                "homepage_description": "SmartMe Technology Ltd helps customers stay connected with expert phone, laptop, desktop, and tablet repairs plus a curated range of devices and accessories.",
                "services_heading": "Professional repair support for everyday devices.",
                "services_description": "These service entries are loaded directly from the Django admin dashboard.",
                "shop_heading": "Browse devices, accessories, and genuine spare parts.",
                "shop_description": "Every item below is loaded from the Django admin, including category, price, uploaded photo, warranty, and specification rows.",
                "about_heading": "SmartMe backed by one manageable system.",
                "about_description": "The public website and key business sections now read from Django, so your admin dashboard controls what visitors see.",
                "reviews_heading": "Customers trust us with the devices they depend on every day.",
                "reviews_description": "Published reviews are managed in the admin dashboard.",
                "faqs_heading": "Questions managed from the admin dashboard.",
                "faqs_description": "Add, edit, or remove FAQs from admin and they update here.",
                "policies_heading": "Website policies controlled from admin.",
                "policies_description": "Policies can be updated centrally from the dashboard.",
                "contact_heading": "Manage details in admin, display them here.",
                "contact_description": "Contact information, social links, and other business details are managed from the admin dashboard.",
                "is_active": True,
            },
        )

        services = [
            ("Phone Repair", "Screen replacement, charging port repair, battery replacement, software recovery, and motherboard consultation.", "Phones", 25, "Within 24 hours"),
            ("Laptop Repair", "Keyboard replacement, SSD upgrades, OS installation, diagnostics, and motherboard consultation.", "Laptops", 40, "Within 24 hours"),
            ("Desktop Support", "Hardware troubleshooting, RAM upgrades, data migration, and full servicing.", "Desktops", 35, "1-2 business days"),
            ("Tablet Support", "Display issues, charging faults, battery swaps, and account setup.", "Tablets", 30, "Within 24 hours"),
        ]
        for name, description, device_type, price, turnaround in services:
            Service.objects.update_or_create(
                name=name,
                defaults={
                    "description": description,
                    "device_type": device_type,
                    "starting_price": price,
                    "turnaround_time": turnaround,
                    "is_active": True,
                },
            )

        products = [
            ("Nova X12 Smartphone", Product.Category.PHONE, 599, "New Arrival", "128GB storage, dual camera, all-day battery, and fast charging.", "12 months", [("Display", "6.5 inch AMOLED"), ("Memory", "8GB RAM / 128GB ROM"), ("Warranty", "12 months")], "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80"),
            ("PixelView S10", Product.Category.PHONE, 489, "Best Seller", "Excellent everyday phone for messaging, photography, and business use.", "12 months", [("Camera", "50MP dual camera"), ("Battery", "5000mAh"), ("Warranty", "12 months")], "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80"),
            ("ProLite Business Laptop", Product.Category.LAPTOP, 849, "Business Choice", "15.6 inch display, 16GB RAM, 512GB SSD, and Intel Core i7 performance.", "12 months", [("Use case", "Office and remote work"), ("Storage", "512GB SSD"), ("Warranty", "12 months")], "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80"),
            ("StudyBook 14", Product.Category.LAPTOP, 649, "Student Pick", "Lightweight laptop with great battery life for coursework, browsing, and meetings.", "12 months", [("Display", "14 inch Full HD"), ("Memory", "8GB RAM / 256GB SSD"), ("Warranty", "12 months")], "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=900&q=80"),
            ("Wireless Earbuds Pro", Product.Category.ACCESSORY, 79, "Audio Gear", "Noise reduction, long battery life, and a compact charging case.", "6 months", [("Battery", "Up to 24 hours with case"), ("Connection", "Bluetooth 5.3"), ("Warranty", "6 months")], "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"),
            ("65W Fast Charger", Product.Category.ACCESSORY, 29, "Fast Charge", "USB-C universal charger for phones, tablets, and compact laptops.", "6 months", [("Category", "Power accessory"), ("Compatibility", "Multi-device"), ("Warranty", "6 months")], "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=80"),
            ("Premium Laptop SSD 1TB", Product.Category.PART, 119, "Upgrade Ready", "High-speed storage upgrade for faster boot times and better productivity.", "6 months", [("Category", "Spare part"), ("Installation", "Available in-store"), ("Warranty", "6 months")], "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=900&q=80"),
        ]
        for name, category, price, badge, description, warranty, specs, image in products:
            product, _ = Product.objects.update_or_create(
                slug=slugify(name),
                defaults={
                    "name": name,
                    "category": category,
                    "price": price,
                    "badge": badge,
                    "description": description,
                    "warranty": warranty,
                    "specs": "\n".join(f"{label}: {value}" for label, value in specs),
                    "image_url": image,
                    "is_active": True,
                },
            )
            ProductSpecification.objects.filter(product=product).delete()
            for index, (label, value) in enumerate(specs, start=1):
                ProductSpecification.objects.create(product=product, label=label, value=value, display_order=index)

        reviews = [
            ("Ruth N.", 5, "My laptop was repaired the same day and the team explained every step clearly."),
            ("Kelvin S.", 5, "Affordable phone screen replacement and the quality was excellent. Highly recommended."),
            ("Patricia M.", 5, "Their shop helped us source office laptops quickly and within budget."),
        ]
        for reviewer_name, rating, comment in reviews:
            Review.objects.update_or_create(
                reviewer_name=reviewer_name,
                comment=comment,
                defaults={"rating": rating, "is_published": True},
            )

        faqs = [
            ("How long does a repair take?", "Most common repairs are completed within 24 hours.", 1),
            ("Do you offer warranties on repairs?", "Yes. Eligible repairs include a limited warranty depending on the part and service provided.", 2),
            ("Can I trade in my old device?", "Yes. We assess eligible devices for trade-in value.", 3),
        ]
        for question, answer, order in faqs:
            FAQ.objects.update_or_create(question=question, defaults={"answer": answer, "display_order": order, "is_active": True})

        policies = [
            (Policy.PolicyType.WARRANTY, "Warranty Policy", "Repairs and selected products include warranty coverage against eligible faults within the stated service window."),
            (Policy.PolicyType.RETURN, "Return & Refund Policy", "Unused products can be returned within the approved return period, subject to the store policy."),
            (Policy.PolicyType.PRIVACY, "Privacy Policy", "Customer data and device details are handled securely and never shared improperly."),
        ]
        for policy_type, title, content in policies:
            Policy.objects.update_or_create(title=title, defaults={"policy_type": policy_type, "content": content, "is_active": True})

        self.stdout.write(self.style.SUCCESS("SmartMe demo data seeded successfully."))
