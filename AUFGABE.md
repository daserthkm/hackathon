## Aufgabe

#### 1. Baue eine Chatansicht mit folgenden Bereichen:
* Räume
* Benutzer
* Nachrichten
* Eingabefeld
* Dialog/Modal zum Erstellen neuer Räume
* Möglichkeit Räume zu löschen
* Mitgliederverwaltung von Räumen

#### Beispiel

![alt text](https://raw.githubusercontent.com/daserthkm/hackathon/master/docs/images/example_stashcat.png)

#### 2. Verwende diese API für die Einbindung folgender Funktionen:
* Links die Räume über GET /rooms abfragen
* Rechts die User über GET /users
* Mittig die Chatnachrichten des ausgewählten Raums laden - GET /chats/[1234]
* Per Eingabefeld neue Nachrichten senden - POST /chats/[1234]

#### 3. Socketevents einbinden
* Die Ansichten sollen sich dynamisch aktualisieren, wenn die jeweiligen Socket-Events ausgelöst werden.
* Neue Nachrichten sollen im Chat unten angehängt werden und der Client soll automatisch scrollen.
* Der Nutzer hat die Möglichkeit Nachrichten zu lesen und damit das automatische Scrollen auszusetzen.
* Das automatische Scrollen wird erst wieder aktiv, wenn an das Ende des Chats gescrollt wird.

#### 4. Nachrichten

#### Text
* Einfache Textnachrichten.
* Links in Nachrichten sollten als solche erkennbar und anklickbar sein.
* Emojiunterstüzung (Optional)

#### Bild
* Für diesen Typ soll zum Text eine Bild-Url im Chat Payload als attachment_url übergeben werden.
* Die Nachricht muss im Chat das Bild zusätzlich zum Text darstellen.

Alle Nachrichten sollen über ein Symbol oder ähnlichem geliked werden können (Endpoint /messages/1234/like).
Das Socketevent dazu soll die Likes an alle Clients dynamisch übertragen, damit sich die Anzahl der likes dynamisch aktualisiert, die Anzahl sollte in der Nachricht sichtbar sein.
  
#### 5. Chatfunktionen

Da es in erster Linie um eine lokale Anwendung handelt, soll der Chat wie unter normalen Umständen erscheinen. 
Um unterschiedliche Nachrichtentypen von unterschiedlichen Absender zu erhalten können dazu folgende Chatbefehle erstellt werden, welche man aus dem Eingabefeld mit vorangehendem "/" aufrufen kann:

* Eingabe: /meme - Holt ein Meme vom Endpoint /random/meme und sendet es in den Chat
  * Hier soll das Bild dem Namen des Meme mit einem anderen User gesendet werden.
* Eingabe: /chuck - Holt ein Chuck Norris joke von /random/chuck und sendet es in den Chat
  * Dies soll eine Nachricht eines anderen Users darstellen

Die Verwendung dieser Endpunkte ist freigestellt, solange etwas Vergleichbares umgesetzt wird.

#### 6. Räume

* Beim Wechseln in einen Raum per Auswahl über die linke Raumliste, soll der Chatinhalt im Nachrichtenbereich geladen werden.
* Es soll aber nur bis zur zuletzt gelesenen Nachricht gescrollt werden, damit man keine Nachrichten übersehen kann.
* Eine Nachricht gilt als gelesen, wenn sie einmal sichtbar gewesen ist.
* Dieser Status muss nur im localStorage abgelegt zu werden und wird nicht in der API gespeichert.
* Sollte der localStorage beim Start leer sein, kann direkt auf die letzte Nachricht gesprungen werden.

#### 7. Mitglieder

* In die Räume sollen Nutzer hinzugefügt werden können.
* Beim Hinzufügen muss im Chat das Socketevent für "join" als Nachricht erscheinen.
* Ebenfalls gilt das gleich, wenn man einen Nutzer wieder aus dem Raum entfernt.
* Auch dieses Socketevent soll als Nachricht auftauchen.

## Bewertung

Bewertet wird:
* Design und optische Umsetzung
* Codequalität
* Funktionalität

## Abgabe

* Bitte das fertige Projekt am Ende zippen und auf die USB Sticks kopieren, die später verteilt werden.
* Alternativ kann das Projekt auch auf github veröffentlicht werden. Den Link dazu anschließend an daniel.seifert@heinekingmedia.de senden.