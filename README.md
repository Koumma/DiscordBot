# DiscordBot

Pour lancer le bot dans un container docker, il faut exécuter les commandes suivantes :

- docker build --rm -t jonathanpog .
- docker run -dit --restart always --name jonathanpog jonathanpog:latest


Pour lancer le bot sans le container, il faut se rendre dans le repertoire bot/app puis exécuter les commandes suivantes : 

- npm ci
- node index.js



Patch note JonathanPog 0.5 :

- ajout commande eth :
      permet de demander au bot si l'ethereum passe en dessous d'un seuil donné en paramètre toutes les x minutes (x donné en paramètre aussi,       valeur par défaut : 10)
- résistance au crash dans la plupart des commandes
