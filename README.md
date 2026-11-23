# Adventskalender

Ein statischer Adventskalender für GitHub Pages. Die Türchen-Inhalte liegen separat in `doors.json`, damit sie ohne Änderungen am JavaScript angepasst werden können.

## Auf GitHub Pages veröffentlichen

1. Änderungen in den `main`-Branch übernehmen.
2. Im Repository **Settings → Pages → Build and deployment** öffnen.
3. Als **Source** `GitHub Actions` auswählen.
4. Der Workflow in `.github/workflows/pages.yml` veröffentlicht die Website bei jedem Push auf `main`. Den Veröffentlichungsstatus findest du unter **Actions**.

## Türchen im Dezember ändern

1. Auf GitHub die Datei `doors.json` öffnen und auf **Edit** (Stift) klicken.
2. Das passende Objekt ändern und die Änderung auf `main` committen. Die Pages-Aktion veröffentlicht die Änderung anschließend automatisch.
3. Es müssen genau 24 Objekte im JSON bleiben.

Pro Türchen:

- `title` — Überschrift
- `url` — Link; YouTube-URLs werden direkt eingebettet
- `image` — Pfad zu einem Bild, z. B. `assets/images/mein-bild.png`; ein Klick öffnet das Original in Vollbild
- `imageAlt` — Alternativtext für das Bild
- `description` — optionale Beschreibung; Feld weglassen, wenn keine Beschreibung gewünscht ist
- `author` — Autorname, standardmäßig `Panikfee`
- `label` — optionale Beschriftung für den Link

Für ein Bild zuerst die Originaldatei nach `assets/images/` hochladen und den Pfad in `image` eintragen. Pro Türchen `url` **oder** `image` angeben. Das Bild wird nicht serverseitig verändert.

## Lokal testen

Im Projektordner einen statischen Server starten, z. B. `python3 -m http.server 8000`, und `http://localhost:8000` öffnen. `doors.json` muss über den Server geladen werden; ein direktes Öffnen von `index.html` funktioniert wegen der Browser-Sicherheitsregeln für `fetch` nicht.

## Hinweise

GitHub Pages hostet statische Dateien. Änderungen an `doors.json` werden nach einem Commit veröffentlicht; direkt über die Kalenderseite selbst lassen sich Inhalte nicht speichern. Für Bearbeitung ohne GitHub-Commit wäre zusätzlich ein CMS oder Backend erforderlich.
