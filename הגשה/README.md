
GITHUB : https://github.com/bardavid-y/HolidayEvents

# Holiday Events - CI/CD DevOps Pipeline
פרויקט זה מדגים אוטומציה מלאה של פיתוח ופריסה (CI/CD) לאפליקציית Node.js, משלב כתיבת הקוד ועד להרצת הקונטיינרים על שרתי היעד באמצעות Jenkins ו-Ansible.

## מבנה הפרויקט
* `Dockerfile` - הוראות בניית ה-Image לאפליקציה מבוסס על Node.js Alpine.
* `Jenkinsfile` - קוד ה-Pipeline המלא שמנהל את כל תהליך ה-CI/CD.
* `ansible/inventory.ini` - קובץ המכיל את כתובות שרתי היעד (Ubuntu) אליהם נפרוס.
* `ansible/deploy.yml` - ה-Ansible Playbook שמתקין Docker (אם חסר), מוריד את ה-Image החדש, ומריץ את הקונטיינר.
* `server.js` / `test/` - קוד המקור של אפליקציית Holiday Events והבדיקות (Tests).

## איך ה-Pipeline עובד
ה-Pipeline ב-Jenkins מוגדר לעבוד במספר שלבים (Stages):
1. **Checkout**: משיכת הקוד המעודכן ביותר מ-GitHub.
2. **Install**: התקנת חבילות (Dependencies) באמצעות `npm ci`.
3. **Test**: הרצת בדיקות אוטומטיות לוידוא תקינות הקוד.
4. **Build & Push**: בניית Docker Image חדש ודחיפתו ל-Docker Hub עם תיוג (Tag) התואם למספר ה-Build.
5. **Deploy**: העברת קבצי ה-Ansible (SCP) לשרת ה-Ansible Control Node, והרצת ה-Playbook מרחוק (SSH) כדי לפרוס את האפליקציה על שרתי היעד.

## אילו שרתים / מכונות נדרשים
לארכיטקטורה זו נדרשים 3-4 רכיבים:
1. **שרת Jenkins**: להרצת ה-Pipeline.
2. **Ansible Control Node**: מכונת VM (בסביבת Proxmox, כתובת: 192.168.1.121) המנהלת את הפריסה.
3. **Target Servers (App Servers)**: לפחות שני שרתי Ubuntu (מוגדרים ב-`inventory.ini`) עליהם רצה האפליקציה בפועל.

## תהליך ה-Deployment (פריסה)
תהליך ה-Deployment מנוהל לחלוטין על ידי Ansible ללא מגע יד אדם:
ה-Playbook מתחבר לשרתי היעד ומוודא ש-Docker ו-Python SDK מותקנים ופועלים. לאחר מכן, הוא מתחבר ל-Docker Hub, מושך את ה-Image עם התגית הספציפית של ה-Build הנוכחי, עוצר קונטיינרים ישנים אם יש, ומריץ את הקונטיינר החדש. בסוף הוא מנקה Images ישנים (Prune).

## באיזה Port האפליקציה רצה?
האפליקציה נחשפת לעולם ורצה על **Port 3000**. 

## הגדרות חשובות שצריך לדעת כדי להריץ את הכל
על מנת שהפרויקט יעבוד בצורה חלקה (Zero-touch deployment), נדרשות ההגדרות הבאות מראש:
* **SSH Keys (Passwordless)**: נדרש מפתח SSH ללא סיסמה משרת ה-Jenkins לשרת ה-Ansible, ומשרת ה-Ansible לכל אחד משרתי היעד (Target Servers).
* **הרשאות Sudo**: המשתמש בשרתי היעד חייב לקבל הרשאת `NOPASSWD` בקובץ ה-sudoers (דרך פקודת `visudo`) כדי ש-Ansible יוכל להתקין את Docker ולהריץ קונטיינרים ללא בקשת סיסמה.
* **Jenkins Credentials**: יש להגדיר ב-Jenkins משתנה סודי (Secret Text) בשם `DOCKER_PASSWORD` עבור ההתחברות ל-Docker Hub.

## הגדרות נוספות בכול שרת 
sudo visudo פתיחה של בכול שרת מטרה
yossi ALL=(ALL) NOPASSWD: ALL הוספה בסוף שורה את  הפקודה 