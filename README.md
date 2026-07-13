<div align="center">

<img src="images/Logo/ProHand Logo.png" alt="ProHand Logo" width="160"/>

# ProHand – Local Services Platform

**Find, book, and manage trusted local service providers — all in one place.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-View%20Site-2ea44f?style=for-the-badge)](https://ashab-uddin.github.io/ProHand-Local-Service-Finder/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Ashab-Uddin/ProHand-Local-Service-Finder)
[![PHP](https://img.shields.io/badge/Backend-PHP-777BB4?style=for-the-badge&logo=php)](https://www.php.net/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql)](https://www.mysql.com/)

**🔗 Live Link: [https://ashab-uddin.github.io/ProHand-Local-Service-Finder/](https://ashab-uddin.github.io/ProHand-Local-Service-Finder/)**

</div>

---

> ⚠️ **Note on the live link:** The badge above points to the GitHub Pages deployment already published from this repository (see the *Deployments* section in the repo sidebar). GitHub Pages only serves **static** files, so the front-end (HTML/CSS/JS) will load, but the **PHP + MySQL backend** (login, bookings, provider dashboard, etc.) requires a PHP-enabled host. For full functionality, deploy the `php/` and database files to a PHP/MySQL server (see [Deployment](#-deployment) below) and update the live link accordingly.

## 📖 About the Project

**ProHand** is a full-stack local service marketplace that connects customers with verified local service providers — such as electricians, mechanics, photographers, AC technicians, and more. Users can browse available services, view pricing, register/login as a customer or provider, book a service, and manage bookings — all through a clean, responsive interface.

## ✨ Features

- 🏠 **Landing Page** with an auto-rotating hero slider and navigation dots
- 🔍 **Browse Services** — view top-rated, categorized local services with images and pricing
- 👤 **Authentication System** — customer & service provider login/registration
- 🧰 **Provider Dashboard** — providers can add and manage their own service listings (`My Services`, `Add Services`)
- 📅 **Booking Management** — users can book services and track them under `My Bookings`
- 🙍 **Profile Management** — manage personal account details
- 💳 **Payment Section** assets for integrating payment workflows
- 📱 **Fully Responsive Design** with a mobile-friendly navigation menu
- 🗄️ **MySQL-backed Database** with setup/installation scripts for quick provisioning

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | PHP |
| Database | MySQL |
| Hosting/Deployment | GitHub Pages (static) / PHP-MySQL host (full stack) |

## 📁 Project Structure

```
ProHand-Local-Service-Finder/
├── images/                     # Logos, favicon, service & payment images
├── index/
│   └── index.html              # Main landing page (frontend entry point)
├── js/
│   └── script.js               # Client-side logic (slider, navigation, page routing)
├── styles/
│   └── style.css                # Global stylesheet
├── php/                         # PHP backend logic (auth, bookings, providers, etc.)
├── database_setup.sql           # Initial database schema & seed data
├── update_database.sql          # Database migration/update script
├── install.php                  # Guided installation script
├── setup_database.php           # Programmatic database setup
├── setup_provider_system.php    # Provider system initialization
├── debug_db_struct.php          # Utility script to inspect DB structure
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- [PHP](https://www.php.net/) 7.4+ (with MySQLi/PDO extension enabled)
- [MySQL](https://www.mysql.com/) or MariaDB
- A local server stack such as [XAMPP](https://www.apachefriends.org/), [WAMP](https://www.wampserver.com/), or [MAMP](https://www.mamp.info/)
- (Optional) [Git](https://git-scm.com/) for cloning the repository

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ashab-Uddin/ProHand-Local-Service-Finder.git
   cd ProHand-Local-Service-Finder
   ```

2. **Move the project into your server's root directory**
   e.g. `htdocs/` for XAMPP, or `www/` for WAMP.

3. **Create a MySQL database** for the project (e.g. `prohand_db`) using phpMyAdmin or the MySQL CLI.

4. **Import the database schema**
   ```bash
   mysql -u root -p prohand_db < database_setup.sql
   mysql -u root -p prohand_db < update_database.sql
   ```
   Or run `install.php` / `setup_database.php` in your browser to complete a guided setup.

5. **Configure database credentials**
   Update the DB connection details (host, username, password, database name) inside the relevant file in the `php/` folder to match your local environment.

6. **Start your local server** (Apache/MySQL via XAMPP, WAMP, etc.) and visit:
   ```
   http://localhost/ProHand-Local-Service-Finder/index/index.html
   ```

## 🌐 Deployment

- **Static frontend**: Already deployed via **GitHub Pages** → [https://ashab-uddin.github.io/ProHand-Local-Service-Finder/](https://ashab-uddin.github.io/ProHand-Local-Service-Finder/)
- **Full-stack (recommended for complete functionality)**: Deploy to any PHP/MySQL-supporting host such as [InfinityFree](https://infinityfree.net/), [000webhost](https://www.000webhost.com/), [Hostinger](https://www.hostinger.com/), or a VPS with LAMP/LEMP configured, then import `database_setup.sql` and `update_database.sql` into your remote MySQL instance.

## 🗺️ Roadmap

- [ ] Integrate a payment gateway for service bookings
- [ ] Add provider ratings & reviews
- [ ] Add search & category filtering for services
- [ ] Add email notifications for booking confirmations
- [ ] Improve admin panel for managing users and providers

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project currently has no license specified. If you'd like others to freely use, modify, or distribute this project, consider adding an [open-source license](https://choosealicense.com/) (e.g. MIT).

## 👤 Author

**Ashab Uddin**
GitHub: [@Ashab-Uddin](https://github.com/Ashab-Uddin)

---

<div align="center">
Made with ❤️ for connecting people with trusted local services.
</div>
