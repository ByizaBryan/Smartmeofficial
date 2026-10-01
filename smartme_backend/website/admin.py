from django.contrib import admin
from django.contrib.auth.admin import GroupAdmin, UserAdmin
from django.contrib.auth.models import Group, User
from django.utils.html import format_html

from .admin_site import smartme_admin_site
from .models import Booking, FAQ, Inquiry, Policy, Product, ProductSpecification, Review, Service, SiteSettings


smartme_admin_site.register(User, UserAdmin)
smartme_admin_site.register(Group, GroupAdmin)


class ProductSpecificationInline(admin.TabularInline):
    model = ProductSpecification
    extra = 3
    fields = ("display_order", "label", "value")
    ordering = ("display_order", "id")


@admin.register(SiteSettings, site=smartme_admin_site)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ("company_name", "phone", "email", "whatsapp_number", "is_active", "updated_at")
    list_filter = ("is_active",)
    search_fields = ("company_name", "phone", "email", "address")
    fieldsets = (
        ("Business Details", {"fields": ("company_name", "tagline", "phone", "email", "address", "business_hours", "whatsapp_number")}),
        ("Social & Map", {"fields": ("facebook_url", "instagram_url", "google_maps_query")}),
        ("Homepage", {"fields": ("homepage_headline", "homepage_description")}),
        ("Services Section", {"fields": ("services_heading", "services_description")}),
        ("Shop Section", {"fields": ("shop_heading", "shop_description")}),
        ("About Section", {"fields": ("about_heading", "about_description")}),
        ("Reviews Section", {"fields": ("reviews_heading", "reviews_description")}),
        ("FAQ Section", {"fields": ("faqs_heading", "faqs_description")}),
        ("Policies Section", {"fields": ("policies_heading", "policies_description")}),
        ("Contact Section", {"fields": ("contact_heading", "contact_description", "is_active")}),
    )


@admin.register(Service, site=smartme_admin_site)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("name", "device_type", "starting_price", "preview_image", "turnaround_time", "is_featured", "is_active")
    list_filter = ("is_featured", "is_active")
    search_fields = ("name", "device_type", "description")
    readonly_fields = ("preview_image",)
    fieldsets = (
        ("Service Details", {"fields": ("name", "device_type", "description")}),
        ("Pricing & Turnaround", {"fields": ("starting_price", "turnaround_time", "is_featured", "is_active")}),
        ("Service Image", {"fields": ("image", "preview_image"), "description": "Select the service image from your computer or device. Uploaded images appear on the public website automatically."}),
    )

    @admin.display(description="Preview")
    def preview_image(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height:64px;border-radius:10px;object-fit:cover;" />', obj.image.url)
        return "No image uploaded"


@admin.register(Product, site=smartme_admin_site)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "price", "badge", "preview_image", "is_featured", "is_active", "updated_at")
    list_filter = ("category", "is_featured", "is_active")
    search_fields = ("name", "slug", "description", "badge", "warranty")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ProductSpecificationInline]
    readonly_fields = ("preview_image",)
    fieldsets = (
        ("Product Details", {"fields": ("name", "slug", "category", "badge", "description")}),
        ("Pricing & Warranty", {"fields": ("price", "warranty", "is_featured", "is_active")}),
        ("Product Image", {"fields": ("image", "preview_image"), "description": "Select the product image from your computer or device. No URL is required in normal use."}),
        ("Legacy Specs", {"fields": ("specs",), "description": "Optional legacy text field. Prefer the structured specifications inline table below."}),
    )

    @admin.display(description="Preview")
    def preview_image(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height:64px;border-radius:10px;object-fit:cover;" />', obj.image.url)
        if obj.image_url:
            return format_html('<img src="{}" style="height:64px;border-radius:10px;object-fit:cover;" />', obj.image_url)
        return "No image uploaded"


@admin.register(Review, site=smartme_admin_site)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("reviewer_name", "rating", "is_published", "created_at")
    list_filter = ("rating", "is_published")
    search_fields = ("reviewer_name", "comment")


@admin.register(Booking, site=smartme_admin_site)
class BookingAdmin(admin.ModelAdmin):
    list_display = ("customer_name", "device_type", "preferred_date", "preferred_time", "channel", "status", "created_at")
    list_filter = ("status", "channel", "preferred_date")
    search_fields = ("customer_name", "phone", "email", "device_type", "issue_description")
    fieldsets = (
        ("Customer", {"fields": ("customer_name", "phone", "email")} ),
        ("Device & Issue", {"fields": ("device_type", "issue_description")} ),
        ("Schedule", {"fields": ("preferred_date", "preferred_time", "channel", "status")} ),
        ("Images", {"fields": ("image",), "description": "Select a booking or repair issue image from your computer or device."}),
    )


@admin.register(Inquiry, site=smartme_admin_site)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ("customer_name", "subject", "preferred_channel", "status", "created_at")
    list_filter = ("status", "preferred_channel")
    search_fields = ("customer_name", "email", "phone", "subject", "message")


@admin.register(FAQ, site=smartme_admin_site)
class FAQAdmin(admin.ModelAdmin):
    list_display = ("question", "display_order", "is_active", "updated_at")
    list_filter = ("is_active",)
    search_fields = ("question", "answer")
    ordering = ("display_order",)


@admin.register(Policy, site=smartme_admin_site)
class PolicyAdmin(admin.ModelAdmin):
    list_display = ("title", "policy_type", "is_active", "updated_at")
    list_filter = ("policy_type", "is_active")
    search_fields = ("title", "content")
