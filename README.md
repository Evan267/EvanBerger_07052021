## Table des Matières
1. [Information Generale](#Information-Generale)
2. [Installation](#Installation)
3. [Éléments fournis](#Éléments-fournis)
4. [Cahier des charges](#Cahier-des-charges)
5. [Notes](#Notes)
6. [Évaluation](#Évaluation)
7. [Contact](#Contact)


### Information Generale
Création d’un réseau social d’entreprise pour améliorer la communication entre collègues : 
* Développer la première version de l'application.
* Implémenter un stockage de données sécurisées en utilisant SQL.
* Gérer un stockage de données l’aide de SQL.
* Authentifier un utilisateur et maintenir sa session.


### Groupomania

![Image text](https://github.com/Evan267/EvanBerger_7_07052021/blob/master/frontend/src/assets/logo.png)
>Développer un reseau social d'entreprise
 

## Installation
- Apres avoir cloner le Repository:

- NODE PACKAGE MANAGER: 
    - lancer la commande: `npm install` dans le terminal pour chacun des dossiers frontend et backend:
    - Pour le frontend dans : `cd .\EvanBerger_7_07052021\frontend`
    - Pour le backend: `cd .\EvanBerger_7_07052021\backend`

- Pour le backend:
    - lancer la commande `cd .\EvanBerger_7_07052021\backend`
    - lancer les commandes : 
        - `npm install --save bcrypt`
        - `npm install --save body-parser`
        - `npm install --save express`
        - `npm install --save express-rate-limit`
        - `npm install --save helmet`
        - `npm install --save jsonwebtoken`
        - `npm install --save multer`
        - `npm install --save mysql2`
        - `npm install --save sequelize`

- Pour la BASE DE DONNÉES MySQL:
    - Utilisation de [XAMP](https://www.apachefriends.org/fr/index.html)(*Lien pour effectuer l'installation*).
    - Démarrer XAMPP : `START` les modules Apache ET MySQL.
    - Se rendre sur [phpMyAdmin](http://localhost/phpmyadmin/index.php) dans le navigateur.
    - Dans *phpMyAdmin*, créer une nouvelle base de données dont le nom sera:  **groupomania**  
    - Importer le fichier: groupomania.sql 

 :partying_face: Félicitation :partying_face:


**Démarrage:**  
*Pour le frontend:*  
  Lancez le frontend avec la commande ``npm run serve``.
  Se rendre sur: http://localhost:8080/

*Pour le backend:*  
  Lancez le backend avec la commande ``npm run start``.
  
Les identifiants de l'admin sont :
- email : groupomania@admin.com
- mdp : GroupoAdmin!63

 
## Éléments fournis
 * Dossier:
    - Frontend 
    - Backend
    - Database SQL


##  Cahier des charges
Construire un réseau social interne pour les employés de Groupomania sur le model de Reddit.
* Les employés pourront partager des GIFs avec leurs collègues.
* Aucune maquette fournis, projet dont la conception est donc personnel: carte blanche sur la forme.
* Logos fournis pour l'habillage du site.
* Organisation "AGILE" adaptée.
* Bade de donnnées relationnelles utilisé par le client.
* Sécurité des données de connexion.
* Présentation des fonctionnalités doit être simple.
* La création d’un compte doit être simple et possible depuis un téléphone mobile.
* Le profil doit contenir très peu d’informations pour que sa complétion soit rapide.
* l’accès à un forum où les salariés publient des contenus multimédias doit être présent.
* les utilisateurs doivent pouvoir facilement repérer les dernières participations des employés.
* la suppression du compte doit être possible.
* le ou la chargé-e de communication Groupomania doit pouvoir modérer les interactions entre salariés.
* Projet codé en JAVASCRIPT.
* Personnaliser le contenu a envoyer à un client web.


## Notes
**Backend:**
 * Framework : **Express**
 * Serveur : **NodeJS**
 * Base de données : **MySQL**
 * ORM : **Sequelize**
 * Serveur Web Local: **XAMP**
  
**Frontend:**
 * Framework: **Vuejs**, **Vue CLI**


## Évaluation
:heavy_check_mark: Ce projet est en cours de validation.


## Contact
* [Email](mailto:evan.berger@outlook.com)






