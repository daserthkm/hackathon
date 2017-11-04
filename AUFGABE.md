## Aufgabe

1. Baue eine Chatansicht mit folgenden Bereichen:
* Räume
* Benutzer
* Nachrichten
* Eingabefeld
* Dialog/Modal zum Erstellen neuer Räume
* Möglichkeit Räume zu löschen
* Mitgliederverwaltung von Räumen

### Beispiel

![alt text](https://raw.githubusercontent.com/daserthkm/hackathon/master/docs/images/example_discord.png)

2. Verwende diese API für die Einbundung folgender Funktionen:
* Links die Räume über GET /rooms abfragen
* Rechts die User über GET /users
* Mittig die Chatnachrichten des ausgewählten Raums laden - GET /chats/[1234]
* Per Eingabefeld neue Nachrichten senden - POST /chats/[1234]

3. Socketevents einbinden
* Die Ansichten sollen sich dynmisch aktualisieren, wenn die jeweiligen Socketevents getriggert werden.
* Neuen Nachrichten sollen im Chat unten angehängt werden und automatisch hinscrollen.
* Der Nutzer hat die Möglichkeit Nachrichten nach zu lesen und damit das automatische Scrollen auszustezen.
* Das automatische Scrollen wird erst wieder aktiv, wenn man an das Ende des Chats scrollt.

4. Nachrichten

### Text
* Einfache Textnachrichten.
* Links in Nachrichten sollten als solche erkennbar und anklickbar sein.
* Emojiunterstüzung (Optional)

### Bild
* Für diesen Typ soll zum Text eine Bildurl im Chat Payload als attachment_url übergeben werden.
* Die Nachricht muss im Chat das Bild zusätzlich zum Text darstellen.

Alle Nachrichten sollen über ein Symbol oder ähnlichem geliked werden können (Endpoint /messages/1234/like).
Das Socketevent dazu soll die Likes an alle Clients dynamisch übertragen, damit sich die Anzahl der likes dynmisch aktualisiert.
Die Anzahl sollte in der Nachricht sichbar sein.
  
5. Chatfunktionen

Da es in erster Linie eine lokale Anwendung ist, soll der Chat wie unter normalen Umständen erscheinen. 
Um unterschiedliche Nachrichtentypen von unterschiedlichen Absender zu erhalten können dazu folgende Chatbefehle erstellt werden,
welche man aus dem Eingabefeld mit vorangehendem "/" aufrufen kann:

* Eingabe: /meme - Holt ein Meme von der API /meme und sendet es in den Chat
  * Hier soll das Bild dem Namen des Meme mit einem anderen User gesendet werden.
* Eingabe: /chuck - Holt ein Chuck Norris joke von der API und sendet es in den Chat
  * Dies soll eine Nachricht eines anderen Users darstellen

Die Verwendung dieser Endpunkte ist freigestellt, solange etwas vergleichbares umgesetzt wird.

6. Räume

* Beim wechseln in einen Raum per Auswahl über die linke Raumliste soll der Chatinhalt im Nachrichtenbereich geladen werden.
* Es soll aber nur bis zur zuletzt gelesenen Nachricht gescrollt werden, damit man keine Nachrichten übersehen kann.
* Eine Nachricht gilt als gelesen, wenn sie einmal sichbar gewesen ist.
* Dieser Status brauch nur im localStorage abgelegt zu werden und wird nicht in der API gespeichert.
* Sollte der localStorage am Anfang leer sein, kann direkt auf die letzte Nachricht gesprungen werden.

7. Mitglieder

* In die Räume sollen verschiedene User hinzugefügt werden können.
* Beim Hinzufügen muss im Chat das Socketevent für join als Nachricht erscheinen.
* Ebenfalls gilt das gleich, wenn man einen User wieder aus dem Raum entfernt.
* Auch dieses Socketevent soll als Nachricht auftauchen.


