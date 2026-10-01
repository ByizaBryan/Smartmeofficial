from django.core.validators import MinValueValidator
from django.db import models


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class SiteSettings(TimestampedModel):
    company_name = models.CharField(max_length=120, default="SmartMe Technology Ltd")
    tagline = models.CharField(max_length=200, blank=True)
    phone = models.CharField(max_length=40)
    email = models.EmailField()
    address = models.CharField(max_length=255)
    business_hours = models.CharField(max_length=120)
    whatsapp_number = models.CharField(max_length=40)
    facebook_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    google_maps_query = models.CharField(max_length=255, blank=True)
    homepage_headline = models.CharField(max_length=255, blank=True)
    homepage_description = models.TextField(blank=True)
    services_heading = models.CharField(max_length=255, blank=True)
    services_description = models.TextField(blank=True)
    shop_heading = models.CharField(max_length=255, blank=True)
    shop_description = models.TextField(blank=True)
    about_heading = models.CharField(max_length=255, blank=True)
    about_description = models.TextField(blank=True)
    reviews_heading = models.CharField(max_length=255, blank=True)
    reviews_description = models.TextField(blank=True)
    faqs_heading = models.CharField(max_length=255, blank=True)
    faqs_description = models.TextField(blank=True)
    policies_heading = models.CharField(max_length=255, blank=True)
    policies_description = models.TextField(blank=True)
    contact_heading = models.CharField(max_length=255, blank=True)
    contact_description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Site settings"
        verbose_name_plural = "Site settings"

    def __str__(self):
        return self.company_name


class Service(TimestampedModel):
    name = models.CharField(max_length=120)
    description = models.TextField()
    device_type = models.CharField(max_length=120, blank=True)
    starting_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    turnaround_time = models.CharField(max_length=120, blank=True)
    image = models.ImageField(upload_to="services/", blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Product(TimestampedModel):
    class Category(models.TextChoices):
        PHONE = "phone", "Phone"
        LAPTOP = "laptop", "Laptop"
        TABLET = "tablet", "Tablet"
        ACCESSORY = "accessory", "Accessory"
        PART = "part", "Spare Part"

    name = models.CharField(max_length=150)
    slug = models.SlugField(unique=True)
    category = models.CharField(max_length=20, choices=Category.choices)
    badge = models.CharField(max_length=80, blank=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    warranty = models.CharField(max_length=120, blank=True)
    specs = models.TextField(help_text="Legacy field. Use structured specifications below in admin.", blank=True)
    image = models.ImageField(upload_to="products/", blank=True, null=True)
    image_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)

    class Meta:
        ordering = ["category", "name"]

    def __str__(self):
        return self.name


class ProductSpecification(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="specifications")
    label = models.CharField(max_length=100)
    value = models.CharField(max_length=255)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["display_order", "id"]
        verbose_name = "Product specification"
        verbose_name_plural = "Product specifications"

    def __str__(self):
        return f"{self.product.name}: {self.label}"


class Review(TimestampedModel):
    reviewer_name = models.CharField(max_length=120)
    rating = models.PositiveSmallIntegerField(default=5)
    comment = models.TextField()
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.reviewer_name} ({self.rating}/5)"


class Booking(TimestampedModel):
    STATUS_CHOICES = [
        ("new", "New"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    customer_name = models.CharField(max_length=120)
    phone = models.CharField(max_length=40)
    email = models.EmailField(blank=True)
    device_type = models.CharField(max_length=120)
    preferred_date = models.DateField(null=True, blank=True)
    preferred_time = models.TimeField(null=True, blank=True)
    issue_description = models.TextField()
    image = models.ImageField(upload_to="bookings/", blank=True, null=True)
    image_url = models.URLField(blank=True)
    channel = models.CharField(max_length=40, blank=True, help_text="WhatsApp, email, website form, etc.")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="new")

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.customer_name} - {self.device_type}"


class Inquiry(TimestampedModel):
    STATUS_CHOICES = [
        ("new", "New"),
        ("responded", "Responded"),
        ("closed", "Closed"),
    ]

    customer_name = models.CharField(max_length=120)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=40, blank=True)
    subject = models.CharField(max_length=150, blank=True)
    message = models.TextField()
    preferred_channel = models.CharField(max_length=40, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="new")

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.subject or f"Inquiry from {self.customer_name}"


class FAQ(TimestampedModel):
    question = models.CharField(max_length=255)
    answer = models.TextField()
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["display_order", "question"]

    def __str__(self):
        return self.question


class Policy(TimestampedModel):
    class PolicyType(models.TextChoices):
        WARRANTY = "warranty", "Warranty"
        RETURN = "return", "Return / Refund"
        PRIVACY = "privacy", "Privacy"

    policy_type = models.CharField(max_length=20, choices=PolicyType.choices)
    title = models.CharField(max_length=120)
    content = models.TextField()
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["policy_type", "title"]
        verbose_name_plural = "Policies"

    def __str__(self):
        return self.title
