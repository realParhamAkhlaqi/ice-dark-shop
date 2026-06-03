# ❄️ ice-dark-shop

An ultra-minimalist, high-fidelity open-source e-commerce storefront architecture. Designed for maximum scannability, extreme dark-mode contrast, and zero visual noise.

### 🎨 Visual Framework (Ice-Dark Palette)
* **Pure Black (#000000):** Stark background base for depth.
* **Graphite Dark (#121212):** Smooth container blocks replacing old clunky borders.
* **Stark White (#FFFFFF):** High-contrast primary typography.
* **Muted Gray (#8E8E93):** Dot-matrix secondary text hierarchy.
* **Powder Ice Blue (#E0F2FE):** 5% strict neon-like active indicators.
* **Metallic Ice Blue (#B9E6FF):** Low-latency hover states and action buttons.

### 📱 UI/UX Philosophy
Heavily inspired by the **Nothing OS** aesthetic—retro-futuristic, clean geometric alignments, dot-matrix detailing, and a premium cool undertone that prevents eye strain during live transactions.


An e-commerce website using  the following tech stacks: Python - Django - PostgreSQL - JavaScript - Bootstrap

## How run the project?

### Clone the repository

```bash
git clone https://github.com/realParhamAkhlaqi/ice-dark-shop.git
cd django-ecommerce
```

### Create a virtualenv and activate it

 ```bash
python3 -m venv venv
. venv/bin/activate
```

### Or on Windows cmd

 ```bash
> py -3 -m venv venv
> venv\Scripts\activate.bat
```

### Install the requirements

```bash
pip3 install -r requirements.txt
```

#### In settings.py, set up the database

for this project i used postgress, you can see the following settings below :

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'db_name',
        'USER': 'db_user',
        'PASSWORD': 'db_user_password',
        'HOST': 'localhost',
        'PORT': '',
    }
}
```

#### Run makemigrations and migrate

```bash
python3 manage.py makemigrations
python3 manage.py migrate
```

#### Run the tests

```bash
python3 manage.py test
```

#### Run the development server

```bash
python3 manage.py runserver
```

Open <http://127.0.0.1:8000> in your browser.

⚖️ Licensed under the MIT License by Parham Akhlaqi (@realParhamAkhlaqi).
