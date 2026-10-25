# Révisions BPMN — SI & BD 1

Site de révision interactif pour l'examen BPMN (Licence Gestion et Management).

**Le site :** https://flous-dev.github.io/revision-bpmn/

## Le parcours (8 niveaux)

1. **Les bases** — processus, concepts clés, familles, BPM/BPMN (QCM)
2. **Les symboles** — fiche visuelle + 2 quiz de reconnaissance
3. **Évènements, passerelles & règles d'or** — QCM de mise en situation
4. **Éléments avancés & collaboration** — sous-processus, frontières, types de tâches, piscines
5. **Lire un logigramme** — vrai / faux sur 3 diagrammes
6. **BPMN → texte** — 5 retranscriptions avec barème et correction
7. **Texte → BPMN** — 2 logigrammes à trous + 2 modélisations guidées sur papier
8. **Examen blanc** — l'annale 2024 en conditions réelles (chrono 2 h)

La partie 4 du cours (UML, cas d'utilisation) n'est pas au programme de l'examen et n'est pas traitée.

## Technique

Site statique, sans dépendance ni build : `index.html` + `assets/`. Les diagrammes BPMN sont dessinés en SVG par un petit moteur maison (`assets/bpmn.js`) à partir des définitions de `assets/diagrams.js`. La progression est enregistrée dans le navigateur (localStorage).

Pour l'ouvrir en local : ouvrir `index.html` dans un navigateur.
