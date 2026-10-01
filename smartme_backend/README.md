# SmartMe Django Admin Backend

This Django project adds a real admin backend for the SmartMe website.

## What you can manage
- Site settings and contact details
- Services
- Products and categories
- Product specifications and prices
- Customer reviews
- Repair bookings
- Customer inquiries
- FAQs
- Policies

## Project location
- Django backend: `D:\Smartte\smartme_backend`
- Website frontend: `D:\Smartte\index.html`

## Commands
Run the database setup from `D:\Smartte\smartme_backend`:

```powershell
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_smartme_demo
```

Start the two local servers in separate terminals:

```powershell
# Public shop, from D:\Smartte
python -m http.server 8000 --bind 0.0.0.0

# Admin backend, from D:\Smartte\smartme_backend
python manage.py runserver 0.0.0.0:8001
```

## Quick admin bootstrap
```powershell
python manage.py bootstrap_admin_user --username byizabryan --password YourStrongPass123 --email you@example.com
```

## URLs
- Public website: `http://localhost:8000/`
- Admin hub: `http://localhost:8000/admin.html`
- Custom admin dashboard: `http://localhost:8001/`
- Django admin editor: `http://localhost:8001/admin/`

The local SQLite database is intentionally excluded from Git. After cloning, run migrations, create an admin account, and seed demo content if desired. Set `SMARTME_DJANGO_SECRET_KEY` to a private value when deploying; the built-in key is for local development only.

## Notes
- The public shop reads managed products, services, reviews, FAQs, policies, and site details from Django.
- Products and accessories support structured specifications plus pricing in admin.
- Public booking, review, and inquiry forms submit to the Django backend for admin review.
