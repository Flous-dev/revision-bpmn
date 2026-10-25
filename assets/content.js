/* Contenu pédagogique : symboles, niveaux, questions, exercices. */

/* ---------- Catalogue des symboles (fiche mémo + quiz) ---------- */
const sm = (nodes, edges = []) => ({ cw: 70, rh: 60, nodes, edges });
const mt = (id, c, r, extra = {}) => Object.assign({ id, t: 'task', c, r, w: 46, h: 32 }, extra);

window.SYMBOLS = [
  { key: 'start', cat: 'Évènements', name: 'Évènement de départ', desc: 'Cercle à bordure fine. Déclenche le processus. Obligatoire, en principe unique. Toujours « catch ».', d: sm([{ id: 'a', t: 'start', c: 0, r: 0 }]) },
  { key: 'start-msg', cat: 'Évènements', name: 'Départ message', desc: 'Le processus démarre à la réception d’un message externe (appel, courrier, email, commande…).', d: sm([{ id: 'a', t: 'start', m: 'message', c: 0, r: 0 }]) },
  { key: 'start-timer', cat: 'Évènements', name: 'Départ timer', desc: 'Démarrage à une date, une heure ou une périodicité (ex. : la paye le dernier jour ouvré du mois).', d: sm([{ id: 'a', t: 'start', m: 'timer', c: 0, r: 0 }]) },
  { key: 'start-cond', cat: 'Évènements', name: 'Départ condition', desc: 'Démarrage quand une règle sur une donnée devient vraie (ex. : stock < 10 unités).', d: sm([{ id: 'a', t: 'start', m: 'condition', c: 0, r: 0 }]) },
  { key: 'start-signal', cat: 'Évènements', name: 'Départ signal', desc: 'Captation d’un signal émis « à la cantonade », sans destinataire précis (ex. : le client lève la main).', d: sm([{ id: 'a', t: 'start', m: 'signal', c: 0, r: 0 }]) },
  { key: 'inter', cat: 'Évènements', name: 'Évènement intermédiaire', desc: 'Cercle à double bordure. Optionnel, survient en cours de processus. Peut être catch ou throw.', d: sm([{ id: 'a', t: 'inter', c: 0, r: 0 }]) },
  { key: 'inter-timer', cat: 'Évènements', name: 'Intermédiaire timer', desc: 'Délai d’attente ou échéance entre deux activités (ex. : attendre 10 min, attendre 11h30).', d: sm([{ id: 'a', t: 'inter', m: 'timer', c: 0, r: 0 }]) },
  { key: 'inter-msg-catch', cat: 'Évènements', name: 'Message reçu (catch)', desc: 'Enveloppe VIDE : le processus attend / reçoit un message de l’extérieur.', d: sm([{ id: 'a', t: 'inter', m: 'message', c: 0, r: 0 }]) },
  { key: 'inter-msg-throw', cat: 'Évènements', name: 'Message envoyé (throw)', desc: 'Enveloppe PLEINE : le processus envoie un message vers l’extérieur.', d: sm([{ id: 'a', t: 'inter', m: 'message', throw: true, c: 0, r: 0 }]) },
  { key: 'inter-cond', cat: 'Évènements', name: 'Intermédiaire condition', desc: 'Le processus attend qu’une condition sur une donnée soit vérifiée (ex. : assiette vide).', d: sm([{ id: 'a', t: 'inter', m: 'condition', c: 0, r: 0 }]) },
  { key: 'inter-signal-throw', cat: 'Évènements', name: 'Signal émis (throw)', desc: 'Triangle PLEIN : diffuse un signal que d’autres processus peuvent capter.', d: sm([{ id: 'a', t: 'inter', m: 'signal', throw: true, c: 0, r: 0 }]) },
  { key: 'link-throw', cat: 'Évènements', name: 'Lien source (throw)', desc: 'Flèche PLEINE : renvoi graphique « Vers … ». Pas de flux sortant. Aucun impact sur le déroulé.', d: sm([{ id: 'a', t: 'inter', m: 'link', throw: true, c: 0, r: 0 }]) },
  { key: 'link-catch', cat: 'Évènements', name: 'Lien cible (catch)', desc: 'Flèche VIDE : point d’arrivée d’un renvoi (même libellé que la source). Pas de flux entrant.', d: sm([{ id: 'a', t: 'inter', m: 'link', c: 0, r: 0 }]) },
  { key: 'end', cat: 'Évènements', name: 'Évènement de fin', desc: 'Cercle à bordure épaisse. Termine le processus ou une branche. Obligatoire, peut être multiple. Toujours « throw ».', d: sm([{ id: 'a', t: 'end', c: 0, r: 0 }]) },
  { key: 'end-msg', cat: 'Évènements', name: 'Fin message', desc: 'Le processus se termine en envoyant un message (ex. : notification au client).', d: sm([{ id: 'a', t: 'end', m: 'message', c: 0, r: 0 }]) },
  { key: 'boundary', cat: 'Évènements', name: 'Frontière interruptive', desc: 'Évènement catch posé sur la bordure d’une activité : s’il survient pendant l’activité, il l’INTERROMPT et lance un flux d’exception.', d: sm([mt('a', 0, 0), { id: 'b', t: 'inter', m: 'timer', on: 'a', side: 'b' }]) },
  { key: 'boundary-ni', cat: 'Évènements', name: 'Frontière non-interruptive', desc: 'Bordure en POINTILLÉS : l’évènement lance un flux supplémentaire SANS interrompre l’activité.', d: sm([mt('a', 0, 0), { id: 'b', t: 'inter', m: 'message', on: 'a', side: 'b', ni: true }]) },

  { key: 'gw-x', cat: 'Passerelles', name: 'Passerelle exclusive (OU exclusif)', desc: 'Losange vide ou avec X. Un SEUL chemin selon une condition. En réunion : récupère le chemin emprunté.', d: sm([{ id: 'a', t: 'gw', g: 'x', c: 0, r: 0 }]) },
  { key: 'gw-empty', cat: 'Passerelles', name: 'Passerelle exclusive (forme vide)', desc: 'Le losange vide est aussi une passerelle exclusive (identique au X). Bonne pratique : une seule forme par diagramme.', d: sm([{ id: 'a', t: 'gw', g: '', c: 0, r: 0 }]) },
  { key: 'gw-par', cat: 'Passerelles', name: 'Passerelle parallèle (ET)', desc: 'Signe +. Division : TOUS les chemins en même temps, sans condition. Réunion : attend que tous soient terminés.', d: sm([{ id: 'a', t: 'gw', g: '+', c: 0, r: 0 }]) },
  { key: 'gw-inc', cat: 'Passerelles', name: 'Passerelle inclusive (OU inclusif)', desc: 'Cercle dans le losange. Un, plusieurs ou tous les chemins dont la condition est vraie. Réunion : attend les chemins activés.', d: sm([{ id: 'a', t: 'gw', g: 'o', c: 0, r: 0 }]) },
  { key: 'gw-ev', cat: 'Passerelles', name: 'Passerelle évènementielle exclusive', desc: 'Pentagone dans un double cercle. Attend plusieurs évènements : le PREMIER qui arrive choisit le chemin. Prévoir un timer de secours.', d: sm([{ id: 'a', t: 'gw', g: 'ev', c: 0, r: 0 }]) },

  { key: 'task', cat: 'Activités', name: 'Tâche', desc: 'Rectangle arrondi. Unité de travail élémentaire (non décomposable). Libellé = VERBE + complément.', d: sm([mt('a', 0, 0, { w: 60, h: 40 })]) },
  { key: 'sub', cat: 'Activités', name: 'Sous-processus (réduit)', desc: 'Marqueur « + » en bas : activité composée, détaillable ailleurs. Libellé = NOM (« Préparation de la commande »).', d: sm([{ id: 'a', t: 'sub', c: 0, r: 0, w: 60, h: 40 }]) },
  { key: 'task-user', cat: 'Activités', name: 'Tâche utilisateur', desc: 'Bonhomme : un humain réalise la tâche à l’aide d’une application (ex. : saisir une commande).', d: sm([mt('a', 0, 0, { k: 'user', w: 60, h: 40 })]) },
  { key: 'task-manual', cat: 'Activités', name: 'Tâche manuelle', desc: 'Main : réalisée sans application ni moteur, a priori sans trace dans le SI (ex. : préparer un plat).', d: sm([mt('a', 0, 0, { k: 'manual', w: 60, h: 40 })]) },
  { key: 'task-service', cat: 'Activités', name: 'Tâche service', desc: 'Engrenage : tâche automatisée, sans intervention humaine, interfacée avec le SI.', d: sm([mt('a', 0, 0, { k: 'service', w: 60, h: 40 })]) },
  { key: 'task-send', cat: 'Activités', name: 'Tâche d’envoi', desc: 'Enveloppe pleine : envoie un message à un participant externe ; terminée une fois le message envoyé.', d: sm([mt('a', 0, 0, { k: 'send', w: 60, h: 40 })]) },
  { key: 'task-receive', cat: 'Activités', name: 'Tâche de réception', desc: 'Enveloppe vide : attend un message d’un participant externe ; terminée une fois le message reçu.', d: sm([mt('a', 0, 0, { k: 'receive', w: 60, h: 40 })]) },
  { key: 'task-rule', cat: 'Activités', name: 'Tâche règle métier', desc: 'Tableau : applique une règle métier ou prend une décision.', d: sm([mt('a', 0, 0, { k: 'rule', w: 60, h: 40 })]) },
  { key: 'loop', cat: 'Activités', name: 'Boucle', desc: 'Flèche circulaire : l’activité se répète TANT QU’une condition est vraie (préciser la condition en commentaire).', d: sm([mt('a', 0, 0, { loop: true, w: 60, h: 40 })]) },
  { key: 'multi-par', cat: 'Activités', name: 'Multi-instance parallèle', desc: '3 traits VERTICAUX : exécutée un nombre de fois défini, toutes les instances EN MÊME TEMPS.', d: sm([mt('a', 0, 0, { multi: 'par', w: 60, h: 40 })]) },
  { key: 'multi-seq', cat: 'Activités', name: 'Multi-instance séquentielle', desc: '3 traits HORIZONTAUX : exécutée un nombre de fois défini, les instances L’UNE APRÈS L’AUTRE.', d: sm([mt('a', 0, 0, { multi: 'seq', w: 60, h: 40 })]) },

  { key: 'flow-seq', cat: 'Flux & conteneurs', name: 'Flux de séquence', desc: 'Trait plein + flèche : ordonne les éléments À L’INTÉRIEUR d’une piscine. Ne sort jamais d’une piscine (R2).', d: sm([mt('a', 0, 0), mt('b', 1.6, 0)], [['a', 'b']]) },
  { key: 'flow-msg', cat: 'Flux & conteneurs', name: 'Flux de message', desc: 'Pointillés, rond côté émetteur, flèche vide côté récepteur : échange ENTRE deux piscines, jamais à l’intérieur (R1).', d: { cw: 70, rh: 60, nodes: [mt('a', 0, 0), mt('b', 0, 1.5)], edges: [['a', 'b', { k: 'm' }]] } },
  { key: 'flow-default', cat: 'Flux & conteneurs', name: 'Chemin par défaut', desc: 'Petit trait oblique sur le flux : chemin pris si aucune autre condition n’est vraie. Le flux ne reste jamais bloqué.', d: sm([{ id: 'g', t: 'gw', g: 'x', c: 0, r: 0 }, mt('b', 1.5, -0.6), mt('c', 1.5, 0.6)], [['g', 'b'], ['g', 'c', { d: true }]]) },
  { key: 'note', cat: 'Flux & conteneurs', name: 'Annotation', desc: 'Crochet + texte relié par des pointillés : apporte une précision (condition de boucle, nombre d’instances…).', d: sm([{ id: 'n', t: 'note', c: 0, r: 0, l: 'Commentaire', max: 12 }, mt('a', 1.8, 0)], [['n', 'a', { k: 'a' }]]) },
  { key: 'pool', cat: 'Flux & conteneurs', name: 'Piscine (pool) et couloirs (lanes)', desc: 'Piscine = un participant (entité, rôle). Couloirs = sous-partition (services, rôles). Une activité = un seul couloir.', d: { cw: 70, rh: 60, pools: [{ id: 'P', l: 'Piscine', top: -0.5, bot: 1.5, lanes: [{ l: 'A', top: -0.5, bot: 0.5 }, { l: 'B', top: 0.5, bot: 1.5 }] }], nodes: [mt('a', 0, 0), mt('b', 1.4, 1)], edges: [['a', 'b']] } },
  { key: 'pool-black', cat: 'Flux & conteneurs', name: 'Piscine « boîte noire »', desc: 'Piscine vide : le participant (souvent externe, ex. le client) n’est pas détaillé, on ne dessine que ses messages.', d: { cw: 70, rh: 60, pools: [{ id: 'P', l: 'CLIENT', top: -0.35, bot: 0.35, black: true }], nodes: [{ id: 'x', t: 'none', c: 0, r: 0 }], edges: [] } }
];

/* ---------- Questions QCM ---------- */
const Q = (q, opts, a, ex, extra = {}) => Object.assign({ q, opts, a, ex }, extra);

window.LEVELS = [
  /* ================= NIVEAU 1 ================= */
  {
    id: 'bases', num: 1, title: 'Les bases : processus & BPMN', short: 'Définitions, concepts clés, familles de processus, BPM.',
    lesson: `
<h3>Qu’est-ce qu’un processus ?</h3>
<div class="callout"><b>Définition (ISO)</b> : un ensemble d’activités corrélées ou interactives qui transforment des <b>éléments d’entrée</b> en <b>éléments de sortie</b>.</div>
<p>Modéliser (cartographier) un processus, c’est capturer une séquence ordonnée d’activités (production, échange, contrôle) visant un <b>objectif</b>, avec les <b>acteurs</b> et les <b>ressources</b> qui les supportent.</p>
<h3>Les 5 concepts clés</h3>
<div class="tbl-wrap"><table>
<tr><th>Concept</th><th>À retenir</th></tr>
<tr><td><b>Objectif</b></td><td>La mission du processus ; chaque processus doit en avoir un bien identifié.</td></tr>
<tr><td><b>Ressource</b></td><td>Moyen informationnel, financier ou matériel utilisé par une activité. <b>Elle n’est pas transformée</b> (contrairement à un élément d’entrée).</td></tr>
<tr><td><b>Acteur</b></td><td>Personne, entité organisationnelle ou application, interne ou externe, responsable d’activités.</td></tr>
<tr><td><b>Résultat</b></td><td>Ce que produit une activité : peut être un évènement, une ressource ou une entrée pour une autre activité.</td></tr>
<tr><td><b>Évènement</b></td><td>Quelque chose qui arrive et influence le déroulement (le déclenche…). <b>Ne consomme aucune ressource, ne produit aucun résultat.</b></td></tr>
</table></div>
<h3>Processus vs procédure</h3>
<ul>
<li><b>Processus</b> : approche managériale, transversale. <i>Que devons-nous faire ? Pourquoi ? Pour quels objectifs ? Avec quels acteurs ?</i></li>
<li><b>Procédure</b> : approche opérationnelle, détaillée. <i>Qu’est-ce qui doit être fait ? Où ? Quand ? Par qui ? Avec quelles ressources ? Quel mode opératoire ?</i></li>
</ul>
<p class="muted">En pratique la frontière est floue : c’est surtout une question de niveau de détail.</p>
<h3>Les 3 familles de processus métier</h3>
<ul>
<li><b>Opérationnels (de réalisation)</b> : cœur du métier, créent la valeur ajoutée. Ex. : gestion des clients, production des voitures.</li>
<li><b>Support</b> : soutiennent les opérationnels, valeur indirecte. Ex. : contrôle du budget, recrutement, support utilisateur.</li>
<li><b>Pilotage / qualité / décisionnel</b> : exigences de qualité et de performance, portés par la direction. Ex. : négociation de partenariat, plan stratégique.</li>
</ul>
<h3>BPM et BPMN</h3>
<ul>
<li><b>BPM</b> = <i>Business Process Management</i> (discipline de gestion : modéliser, piloter, optimiser les processus) <b>ou</b> <i>Business Process Model</i> (la cartographie elle-même).</li>
<li><b>BPMN</b> = <i>Business Process Model and Notation</i> : notation graphique normalisée <b>ISO/CEI 19510</b>, maintenue par l’<b>OMG</b> (fusion avec la BPMI en 2005). Version actuelle <b>2.0.2</b>, norme ISO depuis 2013.</li>
<li>À l’examen : on dessine <b>sur papier</b> (outil en ligne pour s’entraîner : Camunda Modeler).</li>
</ul>
<h3>Bonnes pratiques de libellés (très notées !)</h3>
<div class="callout ok"><b>Tâche</b> = verbe (« Saisir commande », pas « Commande ») · <b>Sous-processus</b> = nom (« Préparation de la commande ») · <b>Évènement</b> = nom / état (« Commande reçue », « 10 min ») · <b>Passerelle</b> = question (« Montant ? ») et chaque flux sortant porte sa réponse (« ≥ 500 € »).</div>`,
    acts: [{
      type: 'quiz', id: 'q-bases', title: 'QCM — les fondamentaux', questions: [
        Q('Selon l’ISO, un processus est…', ['Un ensemble d’activités corrélées qui transforment des éléments d’entrée en éléments de sortie', 'Un document décrivant le mode opératoire d’un poste de travail', 'Un logiciel de gestion des tâches', 'Une suite d’évènements sans activité'], 0, 'C’est la définition ISO du cours : activités corrélées ou interactives, entrées → sorties.'),
        Q('Quelle est la différence entre une ressource et un élément d’entrée ?', ['La ressource n’est pas transformée par l’activité', 'La ressource est toujours financière', 'L’élément d’entrée n’est jamais produit par une autre activité', 'Il n’y a aucune différence'], 0, 'Une ressource est utilisée mais pas transformée ; l’élément d’entrée, lui, est transformé en sortie.'),
        Q('Un évènement…', ['Ne consomme aucune ressource et ne produit aucun résultat', 'Est une unité de travail avec un début et une fin', 'Doit toujours être réalisé par un acteur humain', 'Consomme du temps et des ressources'], 0, 'L’évènement « arrive » : il ne représente aucun travail.'),
        Q('« Que devons-nous faire ? Pourquoi ? Pour quels objectifs ? » Ces questions caractérisent…', ['Un processus', 'Une procédure', 'Une ressource', 'Un évènement'], 0, 'Processus = approche managériale (quoi / pourquoi). Procédure = opérationnelle (où, quand, par qui, comment).'),
        Q('« Où ? Quand ? Par qui ? Avec quel mode opératoire ? » Ces questions caractérisent…', ['Une procédure', 'Un processus', 'Un objectif', 'Une passerelle'], 0, 'La procédure est le niveau opérationnel et détaillé.'),
        Q('« Recrutement d’un employé » est un processus…', ['Support', 'Opérationnel', 'De pilotage', 'Décisionnel'], 0, 'Il soutient les processus opérationnels : c’est un processus support (comme le contrôle du budget).'),
        Q('« Production des voitures » est un processus…', ['Opérationnel (de réalisation)', 'Support', 'De pilotage', 'Qualité'], 0, 'Il est au cœur du métier et crée la valeur ajoutée.'),
        Q('« Conception d’un plan stratégique » est un processus…', ['De pilotage / décisionnel', 'Support', 'Opérationnel', 'Ce n’est pas un processus'], 0, 'Porté par la direction : pilotage, qualité, décisionnel.'),
        Q('Un acteur peut être…', ['Une personne, une entité organisationnelle ou une application, interne ou externe', 'Uniquement une personne interne', 'Uniquement un service de l’entreprise', 'Uniquement un logiciel'], 0, 'Le cours précise : personne, entité ou application, interne ou externe.'),
        Q('Quelle organisation maintient la norme BPMN ?', ['L’OMG (Object Management Group)', 'L’AFNOR', 'Le W3C', 'L’IEEE'], 0, 'Développée par la BPMI puis maintenue par l’OMG depuis leur fusion en 2005. Norme ISO/CEI 19510.'),
        Q('Quel libellé respecte les bonnes pratiques pour une TÂCHE ?', ['Enregistrer la commande', 'Commande', 'Enregistrement de la commande', 'Commande enregistrée'], 0, 'Une tâche commence par un verbe. « Enregistrement de la commande » serait un sous-processus, « Commande enregistrée » un évènement.'),
        Q('Quel libellé convient à un SOUS-PROCESSUS ?', ['Préparation de la commande', 'Préparer commande', 'Commande préparée ?', 'Préparer'], 0, 'Sous-processus = substantif (nom) dérivé du verbe de la tâche d’origine.'),
        Q('Un résultat d’activité peut être…', ['Un évènement, une ressource ou une entrée pour une autre activité', 'Uniquement un document', 'Uniquement un évènement de fin', 'Uniquement de l’argent'], 0, 'Définition du cours : concrétisation partielle ou finale convergeant vers l’objectif.'),
        Q('BPM signifie…', ['Business Process Management ou Business Process Model', 'Basic Process Method', 'Business Planning Model uniquement', 'Base de Processus Métier'], 0, 'L’acronyme a deux sens : la discipline de gestion et la modélisation elle-même.')
      ]
    }]
  },

  /* ================= NIVEAU 2 ================= */
  {
    id: 'symboles', num: 2, title: 'Les symboles BPMN', short: 'Reconnaître chaque symbole au premier coup d’œil (et le dessiner).',
    lesson: `<p>À l’examen, tu dois <b>lire</b> ces symboles (exercice 1) et les <b>dessiner</b> correctement (exercice 2). Mémorise les détails qui changent le sens :</p>
<ul>
<li><b>Bordure de l’évènement</b> : fine = départ, double = intermédiaire, épaisse = fin, pointillés = non-interruptif.</li>
<li><b>Pictogramme vide = catch</b> (on reçoit / on attend), <b>plein = throw</b> (on envoie / on émet).</li>
<li><b>Marqueur de la passerelle</b> : rien ou X = exclusive, + = parallèle, ○ = inclusive, pentagone = évènementielle.</li>
<li><b>Marqueurs en bas d’une activité</b> : + = sous-processus, ⟳ = boucle, ||| = multi-instance parallèle, ≡ = multi-instance séquentielle.</li>
<li><b>Trait plein</b> = flux de séquence (dans une piscine) · <b>pointillés + rond + flèche vide</b> = flux de message (entre piscines).</li>
</ul>
<div class="callout warn">Conseil du corrigé : <b>si tu ne connais pas la spécialisation d’une tâche ou d’un évènement, abstiens-toi</b>. Mieux vaut ne pas spécialiser que se tromper.</div>
<div id="symbol-sheet"></div>`,
    acts: [
      { type: 'symquiz', id: 'q-sym1', title: 'Quel est ce symbole ?', mode: 'name', count: 14 },
      { type: 'symquiz', id: 'q-sym2', title: 'Retrouve le bon symbole', mode: 'pick', count: 12 }
    ]
  },

  /* ================= NIVEAU 3 ================= */
  {
    id: 'flux', num: 3, title: 'Évènements, passerelles & règles d’or', short: 'Catch/throw, les 4 passerelles, chemin par défaut, R1 et R2.',
    lesson: `
<h3>Les 3 briques de base</h3>
<p>Un processus simple = <b>activités</b> + <b>flux de séquence</b> + <b>évènements</b>. Toute modélisation commence par <b>un évènement de départ</b> et se termine par <b>au moins un évènement de fin</b>. Le flux ne peut s’arrêter que sur un évènement de fin.</p>
<h3>Catch ou throw ?</h3>
<ul>
<li>Départs : toujours <b>catch</b> (le processus « attrape » le déclencheur).</li>
<li>Fins : toujours <b>throw</b> (le processus émet vers l’extérieur).</li>
<li>Intermédiaires : les deux. <b>Toujours se placer du point de vue du processus étudié</b> : la demande de note est envoyée par le client mais <i>reçue</i> (catch) par le processus du serveur.</li>
</ul>
<div class="tbl-wrap"><table>
<tr><th>Déclencheur</th><th>Exemple du cours</th></tr>
<tr><td>Message</td><td>La saisie démarre quand le client donne sa commande.</td></tr>
<tr><td>Timer</td><td>La paye démarre le dernier jour ouvrable du mois. / Attendre 11h30 avant d’ouvrir.</td></tr>
<tr><td>Condition</td><td>Le réapprovisionnement démarre quand le stock &lt; 10 unités.</td></tr>
<tr><td>Signal</td><td>Le client lève la main pour appeler un serveur (pas de destinataire précis).</td></tr>
</table></div>
<p>Le timer intermédiaire mesure le délai <b>depuis la fin de l’activité précédente</b> jusqu’au début de la suivante.</p>
<h3>Les deux règles d’or</h3>
<div class="callout warn"><b>R1 — Les messages restent externes</b> : enveloppes et flux de message servent à communiquer avec l’extérieur d’un processus, jamais d’une activité à une autre du même processus.<br><b>R2 — Les flux de séquence restent internes</b> : ils ne sortent jamais d’un processus (d’une piscine).</div>
<h3>Les 4 passerelles</h3>
<div class="tbl-wrap"><table>
<tr><th>Passerelle</th><th>Symbole</th><th>Division</th><th>Réunion</th><th>Mots-clés dans un texte</th></tr>
<tr><td><b>Exclusive</b></td><td>vide ou X</td><td>1 seul chemin selon une condition</td><td>récupère le chemin emprunté</td><td>« si… sinon… », « dans le cas où… »</td></tr>
<tr><td><b>Parallèle</b></td><td>+</td><td>tous les chemins, sans condition</td><td>attend que <b>tous</b> soient finis</td><td>« en parallèle », « en même temps », « simultanément »</td></tr>
<tr><td><b>Inclusive</b></td><td>○</td><td>1, plusieurs ou tous selon conditions</td><td>attend seulement les chemins activés</td><td>« l’un, l’autre ou les deux », « selon les cas », « toujours… et si besoin… »</td></tr>
<tr><td><b>Évènementielle</b></td><td>pentagone</td><td>le 1er évènement qui survient choisit</td><td>— (division seulement)</td><td>« soit… soit…, au bout de X… », « on attend… »</td></tr>
</table></div>
<ul>
<li>Sur une exclusive : on écrit la <b>question</b> sur la passerelle et les <b>critères</b> sur chaque flux sortant.</li>
<li><b>Chemin par défaut</b> (trait oblique) : pris si aucune autre condition n’est vraie → le flux ne reste jamais bloqué. Inutile s’il n’y a que 2 choix complémentaires (OUI/NON).</li>
<li>Une passerelle parallèle ne peut pas être à la fois division et réunion : il en faut <b>deux</b>.</li>
<li>Après une évènementielle, chaque flux sortant mène à un <b>évènement intermédiaire catch</b> (message, timer, condition…). Bonne pratique : <b>un timer de secours</b> pour ne jamais rester bloqué.</li>
</ul>`,
    acts: [{
      type: 'quiz', id: 'q-flux', title: 'QCM — choisir le bon élément', questions: [
        Q('« Le processus de paye démarre le dernier jour ouvrable du mois. » Quel évènement de départ ?', ['Timer', 'Message', 'Condition', 'Signal'], 0, 'Indication temporelle (date, heure, périodicité) → timer.', { svgOpts: ['start-timer', 'start-msg', 'start-cond', 'start-signal'] }),
        Q('« Le réapprovisionnement démarre quand le stock passe sous 10 unités. » Quel évènement de départ ?', ['Condition', 'Timer', 'Message', 'Signal'], 0, 'Une règle de gestion portant sur une donnée → condition.', { svgOpts: ['start-cond', 'start-timer', 'start-msg', 'start-signal'] }),
        Q('« Dès qu’un client envoie sa commande par email, on la traite. » Quel évènement de départ ?', ['Message', 'Signal', 'Condition', 'Timer'], 0, 'Réception d’un message externe adressé au processus.', { svgOpts: ['start-msg', 'start-signal', 'start-cond', 'start-timer'] }),
        Q('« Un thermostat diffuse une alerte que plusieurs services peuvent capter. » Quel déclencheur ?', ['Signal', 'Message', 'Condition', 'Timer'], 0, 'Le signal n’est pas destiné à un destinataire précis : plusieurs processus peuvent le capter.'),
        Q('Un évènement de fin est toujours de type…', ['Throw', 'Catch', 'Catch ou throw selon le cas', 'Ni l’un ni l’autre'], 0, 'Les fins « émettent » vers l’extérieur : throw. Les départs sont catch.'),
        Q('Une enveloppe PLEINE dans un évènement intermédiaire signifie…', ['Le processus envoie un message', 'Le processus reçoit un message', 'Le message est urgent', 'Le message est interne'], 0, 'Plein = throw (émission). Vide = catch (réception).'),
        Q('Le client demande l’addition au serveur. Dans le processus du SERVEUR, cet évènement est…', ['Un message catch (enveloppe vide)', 'Un message throw (enveloppe pleine)', 'Un signal throw', 'Un timer'], 0, 'On se place toujours du point de vue du processus étudié : le serveur reçoit → catch.'),
        Q('Peut-on relier deux activités d’une même piscine par un flux de message ?', ['Non, c’est interdit (R1)', 'Oui, si les activités sont dans deux couloirs différents', 'Oui, toujours', 'Seulement avec une passerelle'], 0, 'R1 : les messages servent à communiquer avec l’extérieur. Entre couloirs d’une même piscine → flux de séquence.'),
        Q('Un flux de séquence peut-il relier deux piscines ?', ['Non, jamais (R2)', 'Oui, si on ajoute un lien', 'Oui, entre boîtes noires', 'Seulement en fin de processus'], 0, 'R2 : les flux de séquence ne sortent jamais d’une piscine. Entre piscines → flux de message.'),
        Q('« Si le client a une carte de fidélité, on applique une remise ; sinon non. » Quelle passerelle ?', ['Exclusive', 'Parallèle', 'Inclusive', 'Évènementielle'], 0, 'Un seul chemin selon une condition → exclusive.', { svgOpts: ['gw-x', 'gw-par', 'gw-inc', 'gw-ev'] }),
        Q('« Le burger, les frites et la boisson du menu sont préparés simultanément. » Quelle passerelle ?', ['Parallèle', 'Exclusive', 'Inclusive', 'Évènementielle'], 0, 'Tous les chemins, sans condition, en même temps → parallèle (puis une parallèle de réunion).', { svgOpts: ['gw-par', 'gw-x', 'gw-inc', 'gw-ev'] }),
        Q('« Le client peut commander des frites, un burger, une boisson, ou n’importe quelle combinaison. » Quelle passerelle ?', ['Inclusive', 'Exclusive', 'Parallèle', 'Évènementielle'], 0, 'Un, plusieurs ou tous les chemins selon les conditions → inclusive.', { svgOpts: ['gw-inc', 'gw-x', 'gw-par', 'gw-ev'] }),
        Q('« On apporte la note soit quand le client la demande, soit au bout d’1 h, soit quand l’assiette est vide. » Quelle passerelle ?', ['Évènementielle exclusive', 'Inclusive', 'Parallèle', 'Exclusive'], 0, 'On attend plusieurs évènements : le premier qui survient décide → évènementielle.', { svgOpts: ['gw-ev', 'gw-inc', 'gw-par', 'gw-x'] }),
        Q('Après une passerelle évènementielle, chaque flux sortant doit mener à…', ['Un évènement intermédiaire de type catch', 'Une tâche utilisateur', 'Un évènement de fin', 'Une autre passerelle'], 0, 'Message reçu, timer, condition… : des évènements que le processus « attrape ».'),
        Q('Bonne pratique avec une passerelle évènementielle :', ['Prévoir un timer de secours', 'Toujours mettre un chemin par défaut', 'La doubler par une parallèle', 'L’utiliser aussi en réunion'], 0, 'Sinon le processus peut rester bloqué si aucun évènement attendu ne se produit.'),
        Q('Une passerelle inclusive en RÉUNION attend…', ['Uniquement les chemins qui ont été activés', 'Tous les chemins', 'Le premier chemin arrivé', 'Rien, elle laisse passer chaque jeton'], 0, 'Elle synchronise seulement les flux effectivement activés en division.'),
        Q('Une même passerelle parallèle peut-elle servir à la fois à diviser et à réunir ?', ['Non, il en faut deux', 'Oui', 'Oui, si on met un chemin par défaut', 'Seulement dans un sous-processus'], 0, 'Règle du cours : une de division, une de réunion.'),
        Q('À quoi sert le chemin par défaut (trait oblique) ?', ['À garantir que le flux ne reste jamais bloqué sur la passerelle', 'À indiquer le chemin le plus fréquent', 'À montrer le chemin parfait', 'À relier deux piscines'], 0, 'Il est pris si aucune autre condition n’est validée. Le flux ne peut s’arrêter que sur un évènement de fin.'),
        Q('Une exclusive a 2 sorties « OUI » et « NON ». Faut-il un chemin par défaut ?', ['Non, les deux choix couvrent tous les cas', 'Oui, toujours', 'Oui, sur le « NON »', 'Oui, sur le « OUI »'], 0, 'Corrigé TD1 : avec 2 choix complémentaires, pas besoin de chemin par défaut.'),
        Q('Le losange vide et le losange avec un X…', ['Sont deux formes de la même passerelle exclusive', 'Sont une exclusive et une parallèle', 'Sont une exclusive et une inclusive', 'Ne veulent rien dire sans libellé'], 0, 'Même passerelle. Bonne pratique : n’utiliser qu’une seule forme par logigramme.'),
        Q('« 10 minutes plus tard, on vérifie la température. » Comment modéliser les 10 minutes ?', ['Évènement intermédiaire timer', 'Évènement de départ timer', 'Tâche « Attendre »', 'Passerelle évènementielle seule'], 0, 'Un délai entre deux activités = timer intermédiaire, libellé « 10 min ».', { svgOpts: ['inter-timer', 'start-timer', 'task', 'gw-ev'] })
      ]
    }]
  },

  /* ================= NIVEAU 4 ================= */
  {
    id: 'avance', num: 4, title: 'Éléments avancés & collaboration', short: 'Sous-processus, frontières, types de tâches, boucles, piscines, liens.',
    lesson: `
<h3>Évènements de lien</h3>
<ul>
<li>Pure aide graphique pour un diagramme trop grand : renvoi entre deux parties, <b>sans impact sur le déroulé</b>.</li>
<li>Par paires : <b>lien source (throw, flèche pleine)</b> → <b>lien cible (catch, flèche vide)</b>, <b>même libellé</b> des deux côtés (« Vers annulation de la commande »).</li>
<li>Plusieurs sources peuvent pointer vers une même cible ; une source ne pointe que vers une seule cible.</li>
<li>Les sources n’ont pas de flux sortant, les cibles pas de flux entrant.</li>
</ul>
<h3>Évènements de frontière (boundary)</h3>
<ul>
<li>Évènement intermédiaire <b>catch</b> posé sur la bordure d’une activité : s’il survient <b>pendant</b> l’activité, il déclenche un <b>flux d’exception</b>.</li>
<li><b>Interruptif</b> (trait plein) : l’activité est interrompue. <b>Non-interruptif</b> (pointillés) : l’activité continue.</li>
<li>S’il survient après la fin de l’activité : aucun impact.</li>
<li>Ne peut <b>jamais être la seule sortie</b> d’une activité : on garde toujours le flux normal. Plusieurs frontières possibles sur une même activité.</li>
<li>Seulement des <b>catch</b> : le plus souvent message, timer ou condition.</li>
</ul>
<h3>Types de tâches (pictogramme en haut à gauche)</h3>
<div class="tbl-wrap"><table>
<tr><th>Type</th><th>Comportement</th><th>Exemple</th></tr>
<tr><td>Utilisateur 👤</td><td>Humain + application informatique</td><td>Saisir commande, Encaisser client</td></tr>
<tr><td>Manuelle ✋</td><td>Sans application, a priori sans trace dans le SI</td><td>Préparer commande, Servir client</td></tr>
<tr><td>Service ⚙</td><td>Automatisée, sans humain, interfacée au SI</td><td>Envoi automatique d’un email</td></tr>
<tr><td>Envoi ✉ (plein)</td><td>Envoie un message externe, finie une fois envoyé</td><td>Envoyer convocation</td></tr>
<tr><td>Réception ✉ (vide)</td><td>Attend un message externe, finie une fois reçu</td><td>Recevoir le bon de commande</td></tr>
<tr><td>Règle métier ▦</td><td>Applique une règle / prend une décision</td><td>Décider d’annuler la commande</td></tr>
</table></div>
<p class="muted">On peut utiliser un évènement message ou une tâche d’envoi/réception : on préfère la tâche quand l’activité est plus qu’un simple envoi/réception.</p>
<h3>Sous-processus</h3>
<ul>
<li>Activité <b>composée</b> d’autres activités. Réduit : marqueur <b>+</b> ; étendu : on dessine la séquence interne.</li>
<li>Libellé = <b>nom</b>. Il a un évènement de début <b>sans marqueur</b> et un ou plusieurs évènements de fin ; ensuite le flux reprend dans le processus parent.</li>
<li>Avantages : lisibilité de bout en bout, approche « top-down » (on n’est pas obligé de tout détailler). Limiter à 2-3 niveaux.</li>
<li>Typique des énoncés : « le directeur ne souhaite pas détailler le processus d’assemblage » → <b>sous-processus réduit</b>.</li>
</ul>
<h3>Activités répétitives</h3>
<ul>
<li><b>Boucle</b> ⟳ : répétition <b>tant qu’une condition</b> est vraie (ex. : saisir la commande jusqu’à ce que toute la table ait commandé).</li>
<li><b>Multi-instance</b> : nombre de fois <b>prédéfini</b>. <b>|||</b> = en parallèle, <b>≡</b> = en séquence (ex. : saisir la commande de chaque convive en séquence, préparer leurs plats en parallèle).</li>
<li>Préciser en annotation la condition de boucle ou le nombre d’instances.</li>
</ul>
<h3>Diagramme de collaboration</h3>
<ul>
<li><b>Piscine (pool)</b> = un participant (entité ou rôle). Soit <b>conteneur</b> de processus, soit <b>boîte noire</b> (processus non décrit, typique d’un participant externe comme le client).</li>
<li><b>Couloirs (lanes)</b> = sous-partitions d’une piscine (rôles, services, application…). <b>Une activité appartient à un et un seul couloir.</b></li>
<li><b>Flux de message</b> : pointillés, <b>rond côté émetteur</b>, <b>flèche côté récepteur</b>, toujours <b>entre deux piscines</b>.</li>
<li>Un message BPMN est un échange abstrait (pas forcément un courrier ou un email).</li>
</ul>`,
    acts: [{
      type: 'quiz', id: 'q-avance', title: 'QCM — éléments avancés', questions: [
        Q('Un évènement de lien…', ['Est une aide graphique sans impact sur le déroulé', 'Envoie un message à un autre processus', 'Interrompt l’activité en cours', 'Démarre un nouveau processus'], 0, 'Il sert à renvoyer d’une partie du schéma à une autre quand il devient trop grand.'),
        Q('Une source de lien (throw) peut pointer vers…', ['Une seule cible', 'Plusieurs cibles', 'Aucune cible', 'Une autre piscine'], 0, 'Plusieurs sources → une cible, oui ; une source → plusieurs cibles, non.'),
        Q('Les deux évènements d’une paire de liens doivent…', ['Porter le même libellé', 'Être dans deux piscines différentes', 'Avoir un flux entrant et un flux sortant', 'Être reliés par un flux de séquence'], 0, 'Bonne pratique (et corrigé TD3) : même étiquette pour le lien throw et le lien catch.'),
        Q('Un évènement de frontière NON-interruptif se reconnaît à…', ['Sa bordure en pointillés', 'Sa bordure épaisse', 'Sa couleur rouge', 'Son pictogramme plein'], 0, 'Pointillés = l’activité continue pendant que le flux d’exception démarre.', { svgOpts: ['boundary-ni', 'boundary', 'end', 'inter-msg-throw'] }),
        Q('Le client part pendant la préparation de sa commande : la préparation s’arrête et la commande est annulée. On modélise…', ['Un évènement de frontière interruptif sur « Préparer commande »', 'Un évènement de frontière non-interruptif', 'Une passerelle parallèle', 'Un lien'], 0, 'L’évènement survient pendant l’activité ET l’arrête → frontière interruptive.'),
        Q('Quel type d’évènement peut être placé en frontière ?', ['Uniquement des catch (message, timer, condition…)', 'Uniquement des throw', 'Des évènements de fin', 'Des évènements de départ'], 0, 'Seuls les évènements que l’activité « attrape » peuvent être en frontière.'),
        Q('Une activité peut-elle n’avoir COMME SEULE sortie qu’un évènement de frontière ?', ['Non, il faut toujours garder le flux normal', 'Oui', 'Oui, si l’évènement est interruptif', 'Oui, dans un sous-processus'], 0, 'La frontière est un flux d’exception, exécuté seulement si l’évènement survient.'),
        Q('« Saisir la commande dans le logiciel de caisse » est une tâche…', ['Utilisateur', 'Manuelle', 'Service', 'Règle métier'], 0, 'Un humain interagit avec une application.', { svgOpts: ['task-user', 'task-manual', 'task-service', 'task-rule'] }),
        Q('« Préparer le plat en cuisine » est une tâche…', ['Manuelle', 'Utilisateur', 'Service', 'Envoi'], 0, 'Aucune application, pas de trace dans le SI.', { svgOpts: ['task-manual', 'task-user', 'task-service', 'task-send'] }),
        Q('« Un email de confirmation est envoyé automatiquement par le système » est plutôt une tâche…', ['Service', 'Manuelle', 'Utilisateur', 'Règle métier'], 0, 'Automatisée, sans intervention humaine, interfacée au SI (une tâche d’envoi est aussi défendable).', { svgOpts: ['task-service', 'task-manual', 'task-user', 'task-rule'] }),
        Q('« Décider d’annuler ou non la commande » est une tâche…', ['Règle métier', 'Réception', 'Manuelle', 'Service'], 0, 'Elle applique une règle métier / prend une décision (comme dans l’annale Cuisine&moi).', { svgOpts: ['task-rule', 'task-receive', 'task-manual', 'task-service'] }),
        Q('Le marqueur « + » dans un petit carré en bas d’une activité indique…', ['Un sous-processus (réduit)', 'Une passerelle parallèle', 'Une multi-instance', 'Une boucle'], 0, 'Un niveau de détail supplémentaire est disponible.', { svgOpts: ['sub', 'gw-par', 'multi-par', 'loop'] }),
        Q('Trois traits VERTICAUX en bas d’une activité signifient…', ['Multi-instance en parallèle', 'Multi-instance en séquence', 'Boucle', 'Sous-processus'], 0, '||| = parallèle (simultané), ≡ = séquentiel (l’un après l’autre).', { svgOpts: ['multi-par', 'multi-seq', 'loop', 'sub'] }),
        Q('« Les pizzas d’une même commande sont préparées l’une après l’autre par le même pizzaiolo. » On utilise…', ['Une multi-instance séquentielle (≡)', 'Une multi-instance parallèle (|||)', 'Une boucle', 'Une passerelle parallèle'], 0, 'Nombre d’instances connu (les pizzas de la commande), exécutées en séquence.', { svgOpts: ['multi-seq', 'multi-par', 'loop', 'gw-par'] }),
        Q('« On saisit les commandes jusqu’à ce que toute la table ait commandé. » On utilise…', ['Une boucle', 'Une multi-instance parallèle', 'Un lien', 'Une frontière'], 0, 'Répétition basée sur une condition (tant que tout le monde n’a pas commandé).', { svgOpts: ['loop', 'multi-par', 'link-throw', 'boundary'] }),
        Q('« Le directeur qualité ne souhaite pas détailler le processus d’assemblage. » On dessine…', ['Un sous-processus réduit « Assemblage »', 'Une tâche « Assembler »', 'Une piscine boîte noire « Assemblage »', 'Rien du tout'], 0, 'Corrigé TD3 : activité composée non détaillée → sous-processus réduit, libellé = nom.'),
        Q('Le client est un participant externe dont « on n’est pas intéressé par le comportement interne ». On le modélise par…', ['Une piscine boîte noire', 'Un couloir de notre piscine', 'Une tâche', 'Un évènement signal'], 0, 'Phrase typique de l’annale : boîte noire + flux de message.', { svgOpts: ['pool-black', 'pool', 'task', 'inter-signal-throw'] }),
        Q('Une activité peut-elle être à cheval sur deux couloirs ?', ['Non, une activité appartient à un seul couloir', 'Oui, si deux acteurs la réalisent', 'Oui, si c’est un sous-processus', 'Oui, avec un flux de message'], 0, 'Règle essentielle : une activité = un et un seul couloir.'),
        Q('Sur un flux de message, le petit rond se trouve…', ['Côté émetteur', 'Côté récepteur', 'Au milieu', 'Il n’y a pas de rond'], 0, 'Rond côté émetteur, flèche (vide) côté récepteur.', { svgOpts: ['flow-msg', 'flow-seq', 'flow-default', 'note'] }),
        Q('Le pizzaiolo informe le manager (même entreprise, même piscine) qu’un ingrédient va manquer. Comment relier les deux ?', ['Par un flux de séquence (entre couloirs)', 'Par un flux de message', 'Par un lien', 'Par un signal'], 0, 'R1 : pas de message à l’intérieur d’une piscine. Entre couloirs → flux de séquence.'),
        Q('Le début d’un sous-processus est…', ['Un évènement de début sans marqueur', 'Un évènement de départ message', 'Un lien cible', 'Il n’en a pas'], 0, 'Il symbolise simplement la continuité du flux parent.')
      ]
    }]
  },

  /* ================= NIVEAU 5 ================= */
  {
    id: 'lecture', num: 5, title: 'Lire un logigramme', short: 'Vrai / faux sur de vrais diagrammes : comprendre avant de rédiger.',
    lesson: `<p>Avant de traduire un BPMN en texte, il faut savoir le <b>lire sans contresens</b>. Pour chaque affirmation, regarde le diagramme et réponds Vrai ou Faux. Méthode :</p>
<ol>
<li>Repère le départ (type ?), les fins (combien ? de quel type ?).</li>
<li>Pour chaque passerelle : son type change tout (une inclusive ≠ une parallèle ≠ une exclusive).</li>
<li>Regarde les libellés des flux (« Toujours », « Si… », « ≤ 100 € ») et les chemins par défaut.</li>
<li>Repère qui fait quoi (couloirs) et ce qui sort de la piscine (flux de message).</li>
</ol>
<div class="callout">Astuce : dans les diagrammes du site, clique sur <span class="kbd">⤢ Plein écran</span> ou utilise le zoom pour mieux lire.</div>`,
    acts: [
      { type: 'tf', id: 'tf-remb', title: 'Demande de remboursement (TD1)', diagram: 'remb', items: [
        ['Il n’y a pas d’évènement intermédiaire sur ce diagramme.', true, 'Vrai : 1 évènement de départ et 3 évènements de fin, aucun intermédiaire.'],
        ['Si un client redemande un remboursement déjà en cours, un nouveau dossier est créé.', false, 'Faux : la passerelle « Dossier existant ? » prend le chemin OUI et on notifie « Demande en cours ».'],
        ['L’absence de chemin par défaut en sortie des passerelles est une erreur de modélisation.', false, 'Faux : chaque passerelle n’a que 2 choix complémentaires, aucun cas n’est oublié.'],
        ['Toutes les demandes inférieures ou égales à 100 € sont remboursées automatiquement.', true, 'Vrai : chemin « ≤ 100 € » directement vers « Rembourser la somme demandée ».'],
        ['Le remboursement n’est possible que si la somme est inférieure ou égale à 100 €.', false, 'Faux : au-delà, « Décider du remboursement » peut aboutir à OUI.'],
        ['La troisième passerelle est une passerelle exclusive.', true, 'Vrai, comme les deux autres (losange vide = exclusive). Mélanger les deux formes est déconseillé.'],
        ['Au bout de 7 jours, le service envoie automatiquement une relance au client.', false, 'Faux : aucun timer sur le diagramme.'],
        ['Le demandeur reçoit un message quelle que soit l’issue.', true, 'Vrai : les 3 fins sont des fins « message » (en cours / traitée / refusée).']
      ] },
      { type: 'tf', id: 'tf-colis', title: 'Envoi de colis (TD2)', diagram: 'colis', items: [
        ['Il y a 2 passerelles exclusives, 2 parallèles et 2 inclusives.', true, 'Vrai : X ×2, + ×2, ○ ×2.'],
        ['Souscrire une assurance est obligatoire.', false, 'Faux : le flux vient d’une inclusive avec la condition « Si assurance nécessaire ».'],
        ['On ne peut déplacer le colis qu’après avoir assigné un transporteur et préparé les documents.', false, 'Faux : on peut aussi passer par la branche « La poste standard » (bordereau complété).'],
        ['Les libellés des activités respectent les bonnes pratiques.', false, 'Faux : ils commencent bien par un verbe, mais sont beaucoup trop longs (corrigé TD2).'],
        ['Compléter le bordereau est facultatif.', false, 'Faux : le flux est marqué « Toujours ».'],
        ['Les 3 couloirs correspondent aux 3 rôles impliqués dans le processus.', true, 'Vrai : manager logistique, employé du bureau, employé d’entrepôt.'],
        ['L’emballage des produits se fait en même temps que le choix du transporteur.', true, 'Vrai : la première passerelle est parallèle.'],
        ['Avec un transporteur spécial, on vérifie quand même si une assurance est nécessaire.', false, 'Faux : la vérification d’assurance n’est que sur la branche « La poste standard ».']
      ] },
      { type: 'tf', id: 'tf-velo', title: 'Location de vélos (exercice inédit)', diagram: 'velo', items: [
        ['Le processus démarre à la réception d’un message du client.', true, 'Vrai : départ message « Demande de location », relié au client par un flux de message.'],
        ['L’encaissement de la caution et la préparation du vélo peuvent se faire en même temps.', true, 'Vrai : passerelle parallèle, puis réunion avant la remise du vélo.'],
        ['Si le vélo n’est pas rendu au bout de 48 h, le processus continue d’attendre son retour.', false, 'Faux : passerelle évènementielle, le premier évènement (ici le timer) l’emporte ; l’autre chemin n’est plus possible.'],
        ['Le vélo est nettoyé à chaque retour.', true, 'Vrai : flux « Toujours » de l’inclusive.'],
        ['Les réparations sont chiffrées à chaque retour.', false, 'Faux : seulement « Si dégâts » (inclusive).'],
        ['« Préparer le vélo » est une tâche utilisateur.', false, 'Faux : pictogramme main = tâche manuelle.'],
        ['La passerelle après « Contrôler l’état du vélo » est parallèle.', false, 'Faux : c’est une inclusive (cercle).'],
        ['L’atelier envoie directement un message au client.', false, 'Faux : aucun flux de message ne part du couloir Atelier.'],
        ['Le client est modélisé comme une boîte noire.', true, 'Vrai : sa piscine est vide, on ne voit que les messages échangés.']
      ] }
    ]
  },

  /* ================= NIVEAU 6 ================= */
  {
    id: 'b2t', num: 6, title: 'Traduire un BPMN en texte', short: 'Partie 1 de l’examen : rédiger un texte fidèle et complet.',
    lesson: `
<p>À l’examen (annale 2024 : 10 points), on te donne un logigramme et tu dois le <b>retranscrire en français</b>. Le barème donne <b>1 point par élément clé</b> retrouvé dans ton texte. Il faut donc être <b>complet</b> et <b>fidèle</b> (ne rien inventer, ne rien oublier).</p>
<h3>Méthode en 6 étapes</h3>
<ol class="method">
<li><b>Délimite</b> : quelle partie traduire ? (« JE RÉPÈTE UNIQUEMENT CETTE BRANCHE ! »). Repère piscines, couloirs, boîtes noires.</li>
<li><b>Démarre par le déclencheur</b> et son type : « Dès réception de… » (message), « Chaque lundi… » (timer), « Lorsque le stock… » (condition).</li>
<li><b>Suis le flux</b> : une phrase par activité, avec <b>qui</b> la fait (couloir) et un verbe d’action.</li>
<li><b>Traduis chaque passerelle avec le bon connecteur</b> (tableau ci-dessous) en citant la condition de chaque chemin.</li>
<li><b>Termine chaque branche</b> : comment finit-elle ? (commande annulée, notification envoyée…).</li>
<li><b>Relis en pointant le schéma</b> : chaque élément (tâche, évènement, passerelle, timer, frontière…) a-t-il sa phrase ?</li>
</ol>
<h3>Dictionnaire symbole → phrase</h3>
<div class="tbl-wrap"><table>
<tr><th>Symbole</th><th>Formulation type</th></tr>
<tr><td>Départ message / timer / condition</td><td>« À réception de… » / « Chaque… », « Le … à 8h » / « Lorsque … atteint… »</td></tr>
<tr><td>Exclusive</td><td>« Si…, alors… Sinon (dans le cas contraire)… » ; chemin par défaut : « dans tous les autres cas… »</td></tr>
<tr><td>Parallèle</td><td>« En parallèle / dans le même temps, … ». Réunion : « Une fois ces deux tâches terminées… »</td></tr>
<tr><td>Inclusive</td><td>« Selon le cas, on … et/ou … » ; « on … toujours, et si nécessaire … »</td></tr>
<tr><td>Évènementielle</td><td>« On attend alors : soit…, soit…, soit, au bout de X jours, … (le premier évènement l’emporte) »</td></tr>
<tr><td>Timer intermédiaire</td><td>« On attend X minutes / X minutes plus tard… »</td></tr>
<tr><td>Message catch / throw</td><td>« À réception de… » / « On envoie / notifie… au client »</td></tr>
<tr><td>Frontière interruptive / non</td><td>« Si pendant X …, alors X est interrompu et … » / « Si pendant X…, sans interrompre X, … »</td></tr>
<tr><td>Sous-processus</td><td>« Le processus d’assemblage (non détaillé ici) démarre… »</td></tr>
<tr><td>Multi-instance / boucle</td><td>« Pour chaque fournisseur, en parallèle… » / « … et ainsi de suite jusqu’à ce que… »</td></tr>
<tr><td>Lien</td><td>« … et on passe à l’annulation de la commande / à la fabrication »</td></tr>
<tr><td>Tâche règle métier</td><td>« Le service décide alors de… »</td></tr>
</table></div>
<div class="callout warn"><b>Pièges</b> : oublier le déclencheur ou une fin · confondre parallèle et inclusive · oublier qui fait l’action · décrire les symboles (« il y a un losange ») au lieu du métier · rajouter des informations absentes du schéma.</div>
<p>Pour chaque exercice : écris ton texte, puis clique sur <b>Corriger</b>. Le site repère les mots-clés de ton texte (indice) et tu coches toi-même les points obtenus, puis tu compares avec la proposition de correction.</p>`,
    acts: [
      { type: 'b2t', id: 'b2t-remb', title: 'Demande de remboursement', level: 'Facile', diagram: 'remb',
        consigne: 'Retranscris ce logigramme en français (comme la question 8 du TD1).',
        points: [
          ['Le processus démarre à la réception d’une demande de remboursement.', [['demande'], ['rembours']]],
          ['On vérifie si un dossier existe déjà.', [['dossier'], ['vérifi|existe|existant|déjà']]],
          ['Si oui, on notifie le demandeur que sa demande est déjà en cours (fin).', [['en cours']]],
          ['Sinon, on crée un dossier de remboursement puis on vérifie la somme demandée.', [['crée|créer|création'], ['somme|montant']]],
          ['Si la somme est ≤ 100 €, le remboursement est effectué automatiquement.', [['100'], ['automatique|directement|rembours']]],
          ['Si elle est > 100 €, on décide d’accepter ou non le remboursement.', [['décid|décision|accept']]],
          ['En cas de refus, le dossier est clôturé et on notifie le refus au demandeur.', [['clôtur|clotur|ferm'], ['refus']]],
          ['Si accepté (ou ≤ 100 €), on rembourse et on notifie le demandeur que la demande est traitée.', [['traité|notifi|inform|prévien']]]
        ],
        model: `<p>Quand une demande de remboursement arrive au service, on vérifie d’abord si un dossier existe déjà. Si c’est le cas, on notifie le demandeur que sa demande est déjà en cours. Dans le cas contraire, on crée un dossier de remboursement, puis on vérifie la somme demandée.</p><p>Si la somme est inférieure ou égale à 100 €, le remboursement est automatique. Si elle est supérieure à 100 €, on décide si on accepte le remboursement : en cas de refus, le dossier est clôturé et on envoie une notification de refus au demandeur.</p><p>Dans tous les cas où le remboursement est accepté, on rembourse la somme demandée et on notifie le demandeur que sa demande a été traitée.</p>` },
      { type: 'b2t', id: 'b2t-temp', title: 'Régulation de la température', level: 'Facile', diagram: 'temp',
        consigne: 'Une salle contient des équipements sensibles à la chaleur. Retranscris le processus de régulation automatique.',
        points: [
          ['Le processus démarre lorsque la température atteint 20 °C (condition).', [['20'], ['atteint|lorsque|quand|dès']]],
          ['Le climatiseur est alors déclenché.', [['déclench|allum|démarr|lanc']]],
          ['On attend 10 minutes puis on prend la température de la salle.', [['10'], ['min']]],
          ['Si elle est > 20 °C : problème, on notifie le responsable (fin).', [['responsable'], ['notifi|prévien|inform|alert']]],
          ['Si elle est < 15 °C : on arrête le climatiseur, fin de la régulation.', [['15'], ['arrêt|éteint|stopp']]],
          ['Sinon (entre 15 et 20 °C), on attend à nouveau 10 min et on recommence (boucle).', [['nouveau|recommenc|ainsi de suite|répét|re-|jusqu']]]
        ],
        model: `<p>Lorsque la température de la salle atteint 20 °C, le climatiseur se déclenche. Dix minutes plus tard, on prend la température de la salle.</p><p>Si elle est supérieure à 20 °C, on considère que le climatiseur a un problème : on notifie le responsable de la salle, ce qui met fin au processus. Si elle est inférieure à 15 °C, le refroidissement est suffisant : on arrête le climatiseur et la régulation se termine.</p><p>Dans tous les autres cas (entre 15 et 20 °C), on attend de nouveau 10 minutes avant de reprendre la température, et ainsi de suite jusqu’à ce qu’elle passe sous 15 °C.</p>` },
      { type: 'b2t', id: 'b2t-resto', title: 'Réservation au restaurant', level: 'Moyen', diagram: 'resto',
        consigne: 'Retranscris le processus de gestion des réservations des employés de salle.',
        points: [
          ['Le processus démarre à la réception d’un appel de demande de réservation.', [['appel|demande'], ['réserv']]],
          ['On demande le nombre de personnes ; au-delà de 8, l’appel est transféré (réservation de groupe, fin).', [['8|huit'], ['transf']]],
          ['Sinon, on demande la date et l’heure souhaitées.', [['date'], ['heure']]],
          ['Si la demande est faite moins d’1 h avant le service, la réservation est refusée.', [['1 ?h|une heure|1 heure'], ['refus']]],
          ['Sinon, on vérifie la capacité (places disponibles).', [['place|capacit|disponib']]],
          ['S’il reste de la place : on demande les coordonnées puis on enregistre la réservation (confirmée au client).', [['coordonn'], ['enregistr']]],
          ['Sinon on demande au client s’il veut une autre date : si oui on recommence, sinon la réservation est abandonnée.', [['autre date|autre propos|nouvelle date'], ['abandon|fin|termin|recommenc|nouveau']]]
        ],
        model: `<p>Le processus démarre à la réception d’un appel pour une demande de réservation. L’employé de salle demande d’abord le nombre de personnes. Pour plus de 8 personnes, il s’agit d’une réservation de groupe : l’appel est transféré au responsable commercial, ce qui termine notre processus.</p><p>Sinon, l’employé demande la date et l’heure souhaitées. Si la demande intervient moins d’une heure avant le début du service, la réservation est refusée et le client en est informé. Dans le cas contraire, l’employé vérifie la capacité de la salle.</p><p>S’il reste des places, il demande les coordonnées du client puis enregistre la réservation, qui est confirmée au client. S’il n’y a plus de place, il demande au client s’il souhaite proposer une autre date : si oui, on redemande la date et l’heure et on revérifie, et ainsi de suite ; si non, la réservation est abandonnée.</p>` },
      { type: 'b2t', id: 'b2t-cabinet', title: 'Cabinet médical (collaboration)', level: 'Moyen', diagram: 'cabinet',
        consigne: 'Retranscris ce diagramme de collaboration en précisant bien qui fait quoi et les échanges avec l’extérieur.',
        points: [
          ['Deux couloirs (secrétariat, médecin) ; patient et Sécurité sociale sont des participants externes.', [['secrét'], ['médecin']]],
          ['À l’arrivée du patient (visite), la secrétaire vérifie si un dossier existe.', [['visite|arriv'], ['dossier']]],
          ['S’il n’existe pas, elle le crée ; sinon elle le complète.', [['crée|créer|création|ouvr']]],
          ['Ensuite, en parallèle, le médecin réalise l’examen médical (avec le patient) et complète le dossier.', [['parallèle|même temps|simultan|pendant'], ['examen']]],
          ['Une fois les deux terminés, le médecin établit l’ordonnance.', [['ordonnance']]],
          ['La secrétaire contrôle ensuite le tiers payant.', [['tiers payant|mutuelle|prise en charge']]],
          ['Tiers payant : la facture est créée et envoyée à la Sécurité sociale.', [['sécurité sociale|sécu'], ['facture']]],
          ['Sinon : la secrétaire attend le paiement du patient puis lui remet le volet de facturation.', [['paie|règle|paiement'], ['volet']]]
        ],
        model: `<p>La consultation implique deux acteurs, le secrétariat et le médecin ; le patient et la Sécurité sociale sont des participants externes avec lesquels on échange des messages.</p><p>À l’arrivée du patient, la secrétaire vérifie si un dossier existe. S’il n’existe pas, elle crée le dossier ; sinon, elle le complète. Le médecin réalise ensuite l’examen médical du patient (sous-processus avec échanges avec le patient) et, en parallèle, complète le dossier avec ses observations. Une fois ces deux activités terminées, il crée l’ordonnance.</p><p>La secrétaire contrôle alors si le patient bénéficie du tiers payant. Si oui, elle crée la facture, qui est envoyée à la Sécurité sociale. Sinon, elle attend le paiement du patient puis lui remet le volet de facturation à adresser à sa caisse d’assurance maladie.</p>` },
      { type: 'b2t', id: 'b2t-velo', title: 'Location de vélos (inédit, type examen)', level: 'Difficile', diagram: 'velo',
        consigne: 'Retranscris l’intégralité du processus. Attention aux types de passerelles et aux échanges avec le client.',
        points: [
          ['Agence avec deux couloirs (Accueil, Atelier) ; le client est externe (boîte noire).', [['accueil'], ['atelier']]],
          ['À réception d’une demande de location, l’accueil vérifie la disponibilité.', [['demande'], ['disponib']]],
          ['Si aucun vélo n’est disponible, un refus est envoyé au client (fin).', [['refus']]],
          ['Sinon, en parallèle : l’accueil encaisse la caution et l’atelier prépare le vélo.', [['parallèle|même temps|simultan|pendant'], ['caution'], ['prépar']]],
          ['Une fois les deux terminés, le vélo est remis au client.', [['remet|remis|remise']]],
          ['On attend ensuite le premier évènement : retour du vélo ou délai de 48 h.', [['48'], ['retour|rendu|rend']]],
          ['Sans retour sous 48 h, la caution est conservée et le client en est informé (fin).', [['conserv|garde|encaiss']]],
          ['Au retour, l’atelier contrôle l’état : il nettoie toujours le vélo et chiffre les réparations s’il y a des dégâts.', [['contrôl|vérifi'], ['nettoi|nettoy'], ['dégât|répar']]],
          ['Enfin l’accueil restitue la caution (moins les réparations) au client : location clôturée.', [['restitu|rend|rembours']]]
        ],
        model: `<p>Le processus de location de VéloCité fait intervenir l’accueil et l’atelier ; le client est un participant externe avec lequel on échange des messages.</p><p>À réception d’une demande de location, l’accueil vérifie la disponibilité des vélos. Si aucun vélo n’est disponible, un refus est envoyé au client et le processus s’arrête. Sinon, deux activités se déroulent en parallèle : l’accueil encaisse la caution pendant que l’atelier prépare le vélo. Une fois ces deux activités terminées, l’accueil remet le vélo au client.</p><p>On attend alors le premier des deux évènements suivants. Si le vélo n’est pas rendu au bout de 48 h, la caution est conservée et le client en est informé. Si le vélo est rendu, l’atelier contrôle son état : il le nettoie systématiquement et, s’il constate des dégâts, chiffre aussi les réparations. Une fois ces travaux terminés, l’accueil restitue au client sa caution, diminuée le cas échéant du montant des réparations, ce qui clôture la location.</p>` }
    ]
  },

  /* ================= NIVEAU 7 ================= */
  {
    id: 't2b', num: 7, title: 'Traduire un texte en BPMN', short: 'Partie 2 de l’examen : modéliser à partir d’un énoncé.',
    lesson: `
<p>À l’examen (annale 2024 : 20 points), on te donne un texte et tu dessines le logigramme <b>sur papier</b>. Rappel du prof : <b>« Lisez bien tout l’énoncé avant de commencer à dessiner ! »</b></p>
<h3>Méthode en 7 étapes</h3>
<ol class="method">
<li><b>Lis tout</b> une première fois sans dessiner.</li>
<li><b>Périmètre & acteurs</b> : quel est le processus ? Qui intervient ? → une piscine pour l’organisation, <b>un couloir par rôle</b>, une <b>piscine boîte noire</b> pour chaque participant externe dont on ignore le comportement (client, préfecture, Sécurité sociale…).</li>
<li><b>Déclencheur</b> : quel évènement démarre tout ? (message, timer, condition, signal).</li>
<li><b>Chemin parfait d’abord</b> (quand tout va bien), puis <b>ajoute les exceptions</b> une par une (comme dans le TD Cuisine&moi).</li>
<li><b>Surligne les mots-clés</b> pour choisir les symboles (tableau ci-dessous).</li>
<li><b>Libelle tout</b> : tâches = verbe, sous-processus = nom, évènements = nom/état, passerelles = question, flux sortants = réponses.</li>
<li><b>Vérifie</b> la checklist finale.</li>
</ol>
<h3>Mots-clés → symboles</h3>
<div class="tbl-wrap"><table>
<tr><th>Dans le texte…</th><th>On dessine…</th></tr>
<tr><td>« à réception de », « quand une commande arrive », « il envoie »</td><td>Évènement / tâche message (+ flux de message vers la boîte noire)</td></tr>
<tr><td>« chaque jeudi matin », « 10 minutes plus tard », « au bout de 2 h », « sous 8 jours »</td><td>Timer (départ, intermédiaire, ou dans une évènementielle)</td></tr>
<tr><td>« si…, sinon… », « dans le cas où… »</td><td>Passerelle exclusive</td></tr>
<tr><td>« en parallèle », « dans le même temps »</td><td>Passerelle parallèle (division + réunion)</td></tr>
<tr><td>« … et/ou … », « toujours …, et si besoin … »</td><td>Passerelle inclusive</td></tr>
<tr><td>« soit le client vient, soit au bout de 2 h… », « s’il ne répond pas sous 8 jours ou s’il refuse… »</td><td>Passerelle évènementielle + évènements catch</td></tr>
<tr><td>« si pendant la préparation… »</td><td>Évènement de frontière (interruptif ou non selon que l’activité s’arrête)</td></tr>
<tr><td>« ne souhaite pas détailler », « implique une suite d’activités »</td><td>Sous-processus réduit (+)</td></tr>
<tr><td>« pour chaque élève », « les unes après les autres »</td><td>Multi-instance (≡ séquence / ||| parallèle)</td></tr>
<tr><td>« et ainsi de suite », « jusqu’à ce que »</td><td>Boucle (marqueur ou flux de retour vers une passerelle)</td></tr>
<tr><td>« la conversation s’arrête », « ce qui met fin au processus »</td><td>Évènement de fin (une fin par issue, avec un libellé différent)</td></tr>
</table></div>
<h3>Checklist finale (avant de rendre la copie)</h3>
<ul>
<li>Un évènement de départ typé, et chaque chemin se termine par un <b>évènement de fin</b> libellé.</li>
<li><b>R1</b> : aucun flux de message à l’intérieur d’une piscine. <b>R2</b> : aucun flux de séquence entre piscines.</li>
<li>Chaque activité est dans <b>un seul couloir</b>, celui de l’acteur qui la réalise.</li>
<li>Chaque passerelle de division parallèle/inclusive a sa passerelle de réunion.</li>
<li>Les passerelles exclusives sont libellées (question) ainsi que leurs flux (réponses).</li>
<li>Rien d’inventé, rien d’oublié : chaque phrase de l’énoncé est-elle dans le schéma ?</li>
</ul>
<div class="callout">Les 2 premiers exercices sont <b>à trous</b> (clique sur les cases pointillées pour les compléter). Les suivants se font <b>sur papier</b> : analyse guidée → dessin → correction et auto-évaluation.</div>`,
    acts: [
      { type: 'fill', id: 'fill-pack', title: 'Pack&Send — logigramme à trous', level: 'Facile', diagram: 'pack',
        text: `<p>« Nous recevons à l’entrepôt une <b>demande de préparation colis</b> dès qu’un client a passé commande. Les produits sont alors <b>collectés</b> dans l’entrepôt. Puis on les <b>emballe</b>. Le bordereau d’expédition et l’étiquette de destination sont <b>édités par le service administratif</b>. On intègre ensuite le bordereau dans le colis et on l’étiquette (<b>finalisation</b>) avant de l’<b>expédier</b>. Notre travail s’arrête là. Une <b>assurance</b> supplémentaire est nécessaire si la valeur de la commande est <b>supérieure à 500 €</b> : le service administratif doit alors la souscrire avant l’édition du bon d’expédition. »</p>` },
      { type: 'fill', id: 'fill-biblio', title: 'Bibliothèque — logigramme à trous', level: 'Moyen', diagram: 'biblio',
        text: `<p>« Dans notre bibliothèque, le processus de gestion des emprunts est déclenché par une <b>demande d’emprunt</b> d’un adhérent. Avant d’enregistrer un prêt, il faut tout d’abord <b>rechercher la fiche de l’adhérent</b>, puis <b>valider la possibilité d’emprunt</b>. La <b>création d’un adhérent</b> implique une suite d’activités, de même que la validation de la possibilité d’emprunt. Tous les adhérents ne rendent pas leur emprunt dans les temps : après <b>1 mois</b>, on déclenche un processus de <b>gestion de litige</b> avant de terminer. La dernière étape consiste à <b>enregistrer le retour</b>, une fois l’ouvrage rendu, ce qui met fin au processus. »</p>` },
      { type: 't2b', id: 't2b-embauche', title: 'Processus d’embauche', level: 'Moyen', diagrams: ['embauche'],
        text: `<p>La politique d’embauche de la société impose que tout candidat retenu par le <b>service RH</b> réussisse <b>deux entretiens</b> avec des employés. Le service RH choisit deux employés ayant le même domaine de compétence que le candidat. Un email est <b>automatiquement</b> adressé au premier interviewer : il doit <b>contacter le candidat</b>, lui <b>faire passer l’entretien</b>, puis <b>remplir un formulaire</b> en ligne pour donner son verdict.</p><p>En cas d’échec, un email est directement envoyé au candidat pour lui signifier que la société ne donne pas suite. Sinon, un email est automatiquement adressé au <b>second interviewer</b> qui suit les mêmes étapes. Là encore, le verdict saisi entraîne une notification automatique de succès ou d’échec au candidat.</p>`,
        steps: [
          Q('Comment organiser les participants ?', ['Une piscine avec 3 couloirs (RH, Interviewer 1, Interviewer 2) + le candidat en boîte noire', 'Quatre piscines séparées (RH, Interviewer 1, Interviewer 2, Candidat)', 'Une seule piscine sans couloir', 'Une piscine Candidat détaillée avec ses activités'], 0, 'Les interviewers sont des employés de la société : même piscine, couloirs distincts. Le candidat est externe → boîte noire.'),
          Q('Quel évènement de départ ?', ['Condition « Candidat retenu »', 'Timer', 'Signal', 'Fin message'], 0, 'Le corrigé utilise une condition (le candidat est retenu par les RH). Un départ message serait aussi défendable.', { svgOpts: ['start-cond', 'start-timer', 'start-signal', 'end-msg'] }),
          Q('« Un email est automatiquement adressé au premier interviewer. » Comment le modéliser ?', ['Une tâche service dans le couloir RH, suivie d’un flux de SÉQUENCE vers le couloir Interviewer 1', 'Un flux de message entre le couloir RH et le couloir Interviewer 1', 'Un évènement signal', 'Une tâche manuelle de l’interviewer'], 0, 'Piège R1 : RH et interviewer sont dans la même piscine → pas de flux de message entre eux. L’automatisme = tâche service.'),
          Q('« Faire passer l’entretien » au candidat :', ['Un sous-processus « Entretien » avec des flux de message vers/depuis le candidat', 'Une tâche manuelle sans lien avec le candidat', 'Une passerelle évènementielle', 'Un lien'], 0, 'L’entretien est une activité composée qui échange avec le candidat (externe).'),
          Q('Après « Remplir formulaire », comment représenter le verdict ?', ['Passerelle exclusive « Entretien réussi ? » avec OUI / NON', 'Passerelle parallèle', 'Passerelle inclusive', 'Évènement timer'], 0, 'Un seul chemin selon le verdict.'),
          Q('L’email d’échec envoyé au candidat termine le processus. On dessine…', ['Un évènement de fin message, relié au candidat par un flux de message', 'Un évènement de fin simple', 'Un message intermédiaire catch', 'Un signal throw'], 0, 'Fin + envoi d’un message externe = fin message.', { svgOpts: ['end-msg', 'end', 'inter-msg-catch', 'inter-signal-throw'] })
        ],
        checklist: [
          'Piscine « Embauche » avec 3 couloirs : Service RH, Interviewer 1, Interviewer 2',
          'Piscine Candidat en boîte noire, échanges uniquement par flux de message (pointillés)',
          'Évènement de départ « Candidat retenu » (condition) dans le couloir RH',
          'Tâche « Choisir 2 interviewers » (RH)',
          'Envoi automatique de la demande à l’interviewer 1 (tâche service) puis flux de séquence vers son couloir',
          'Interviewer 1 : contacter le candidat → entretien (sous-processus) → remplir formulaire',
          'Passerelle exclusive « Entretien réussi ? » avec NON → fin message « Échec » vers le candidat',
          'OUI → même séquence pour l’interviewer 2 (tâche service, contacter, entretien, formulaire)',
          'Seconde passerelle : NON → fin message échec ; OUI → fin message « Embauche du candidat »',
          'Libellés corrects (verbes pour les tâches, nom pour le sous-processus, questions sur les passerelles)'
        ] },
      { type: 't2b', id: 't2b-veto', title: 'Clinique vétérinaire (inédit, type examen)', level: 'Difficile', diagrams: ['veto'],
        text: `<p>La clinique VétoPlus souhaite modéliser son processus de consultation. Il fait intervenir l’<b>accueil</b> et le <b>vétérinaire</b>. On représente le <b>propriétaire</b> de l’animal pour dessiner les échanges, mais son comportement interne ne nous intéresse pas.</p><p>Le processus démarre à l’<b>arrivée du propriétaire</b> avec son animal. L’accueil recherche la fiche de l’animal ; si elle n’existe pas, il la crée (cette création implique plusieurs étapes que l’on ne détaille pas). L’accueil <b>pèse</b> ensuite l’animal.</p><p>Le vétérinaire réalise alors l’<b>examen</b> de l’animal (activité non détaillée). Si, <b>pendant l’examen</b>, l’animal présente une <b>urgence vitale</b>, l’examen est <b>interrompu</b> et l’animal est transféré en soins intensifs, ce qui met fin au processus. À l’issue de l’examen, selon les besoins, le vétérinaire <b>vaccine</b> l’animal et/ou lui <b>administre un traitement</b>, puis rédige l’<b>ordonnance</b>.</p><p>L’accueil encaisse ensuite la consultation et remet l’ordonnance et la facture au propriétaire. <b>Sept jours plus tard</b>, un <b>SMS de suivi</b> est envoyé <b>automatiquement</b> au propriétaire, ce qui clôture la consultation.</p>`,
        steps: [
          Q('Le propriétaire est représenté…', ['Par une piscine boîte noire, reliée par des flux de message', 'Par un couloir de la piscine Clinique', 'Par une tâche « Propriétaire »', 'Il n’est pas représenté'], 0, '« Son comportement interne ne nous intéresse pas » = boîte noire.', { svgOpts: ['pool-black', 'pool', 'task', 'note'] }),
          Q('La création de la fiche (« plusieurs étapes que l’on ne détaille pas ») est…', ['Un sous-processus réduit « Création de la fiche »', 'Une tâche « Créer fiche »', 'Une boucle', 'Une multi-instance'], 0, 'Activité composée non détaillée → sous-processus réduit, libellé = nom.', { svgOpts: ['sub', 'task', 'loop', 'multi-par'] }),
          Q('« Si, pendant l’examen, l’animal présente une urgence vitale, l’examen est interrompu… » →', ['Évènement de frontière interruptif (condition) sur l’examen', 'Évènement de frontière non-interruptif', 'Passerelle exclusive après l’examen', 'Passerelle parallèle'], 0, '« Pendant » + « interrompu » → frontière interruptive (bordure pleine). Une exclusive après l’examen arriverait trop tard.', { svgOpts: ['boundary', 'boundary-ni', 'gw-x', 'gw-par'] }),
          Q('« Selon les besoins, il vaccine l’animal et/ou lui administre un traitement » →', ['Passerelle inclusive (division puis réunion)', 'Passerelle exclusive', 'Passerelle parallèle', 'Passerelle évènementielle'], 0, '« et/ou » : un, l’autre ou les deux → inclusive.', { svgOpts: ['gw-inc', 'gw-x', 'gw-par', 'gw-ev'] }),
          Q('« Sept jours plus tard, un SMS est envoyé automatiquement » →', ['Timer intermédiaire « 7 jours » puis tâche service « Envoyer SMS de suivi »', 'Départ timer', 'Tâche manuelle « Attendre 7 jours »', 'Passerelle évènementielle'], 0, 'Un délai entre deux activités = timer intermédiaire ; automatique = tâche service (+ flux de message vers le propriétaire).'),
          Q('Le vétérinaire et l’accueil se passent la main. Quel flux entre leurs couloirs ?', ['Flux de séquence', 'Flux de message', 'Association', 'Lien'], 0, 'Même piscine (la clinique) → flux de séquence (R1).')
        ],
        checklist: [
          'Piscine Clinique avec 2 couloirs (Accueil, Vétérinaire) + Propriétaire en boîte noire',
          'Départ message « Arrivée du propriétaire » (flux de message depuis le propriétaire)',
          'Rechercher la fiche → exclusive « Fiche existante ? » ; NON → sous-processus « Création de la fiche » ; réunion',
          'Tâche « Peser l’animal » (accueil)',
          'Sous-processus « Examen de l’animal » dans le couloir Vétérinaire',
          'Frontière interruptive « Urgence vitale » → transfert en soins intensifs → fin',
          'Inclusive : vacciner et/ou traiter, puis inclusive de réunion',
          'Rédiger l’ordonnance (vétérinaire) puis encaisser (accueil) : flux de séquence entre couloirs',
          'Remise ordonnance + facture au propriétaire (envoi + flux de message)',
          'Timer « 7 jours » → tâche service SMS (flux de message) → fin « Consultation clôturée »'
        ] }
    ]
  },

  /* ================= NIVEAU 8 ================= */
  {
    id: 'exam', num: 8, title: 'Examen blanc (annale 2024)', short: 'Les deux exercices de l’annale, en conditions réelles : 2 h, sans document.',
    lesson: `<p>Voici le sujet de l’examen de mi-semestre 2024 (contrôle continu), dans les conditions de l’examen : <b>2 heures</b>, <b>aucun document</b>, dessin <b>sur papier</b>.</p>
<ul>
<li><b>Exercice 1 (10 pts)</b> — BPMN → texte : retranscrire <b>uniquement</b> la branche « Capacité OK, stock KO » du logigramme Cuisine&moi (surlignée en orange).</li>
<li><b>Exercice 2 (20 pts)</b> — texte → BPMN : modéliser le processus « Livraison de pizza » de Domi’Hut.</li>
</ul>
<div class="callout warn">Joue le jeu : lance le chrono, ne regarde pas les corrections avant la fin, puis note-toi honnêtement avec les barèmes.</div>`,
    acts: [
      { type: 'timer', id: 'exam-timer', title: 'Chronomètre d’examen', minutes: 120 },
      { type: 'b2t', id: 'exam-ex1', title: 'Exercice 1 — « Revoilà les cuisines ! » (10 pts)', level: 'Examen', diagram: 'cuisine', dim: true,
        consigne: 'Nous revoilà chez Cuisine&moi ! Retranscris en français la partie du logigramme correspondant à la branche « Capacité OK ET Stock KO » (en orange). UNIQUEMENT CETTE BRANCHE !',
        points: [
          ['On fait une demande de délai de réapprovisionnement auprès du ou des fournisseurs.', [['fournisseur'], ['réappro|délai|approvision']]],
          ['En parallèle, on réserve les produits semi-finis en stock (pour qu’une autre commande ne les considère pas disponibles).', [['réserv'], ['stock|semi']]],
          ['On vérifie le délai : si tout peut être réapprovisionné en moins de 3 semaines…', [['3 semaines|trois semaines']]],
          ['… on crée un ordre de confirmation et on notifie le client du délai.', [['client'], ['confirm|notifi|inform']]],
          ['Si le client ne répond pas sous 8 jours ou infirme sa commande, elle est annulée (de même si le délai dépasse 3 semaines).', [['8 jours|huit jours'], ['annul']]],
          ['Si le client confirme, le sous-processus de réapprovisionnement (non détaillé) démarre ; il se termine quand tous les produits sont reçus, puis on passe à la fabrication.', [['confirm'], ['fabrication|reçu|réceptionn|reçoi']]],
          ['Pour éviter le blocage, au bout de 3 semaines un timer (non-interruptif) se déclenche sur le réapprovisionnement.', [['3 semaines|trois semaines'], ['bloqu|fig|automatiquement|timer|délai']]],
          ['Le service approvisionnement relance alors les fournisseurs en attente.', [['relanc']]],
          ['Il décide ensuite d’annuler ou non la commande ; si oui, un signal annule les réappros en cours et on passe à l’annulation de la commande.', [['décid|décision'], ['annul']]],
          ['Sinon, on revient au / on laisse continuer le sous-processus de réapprovisionnement.', [['continu|revien|poursui|reprend']]]
        ],
        model: `<p>Si l’entreprise a la capacité de produire la cuisine mais que le stock de produits semi-finis ne permet pas de confirmer la commande, on fait une demande de délai de réapprovisionnement auprès du ou des fournisseurs <b>(1)</b>. En parallèle, on réserve les produits semi-finis en stock afin qu’une prochaine commande ne les considère pas comme disponibles <b>(2)</b>.</p><p>Ensuite, on vérifie le délai : si tous les produits peuvent être réapprovisionnés en moins de 3 semaines <b>(3)</b>, on crée un ordre de confirmation qui informe le client du délai de sa commande <b>(4)</b>. Si le client confirme, le réapprovisionnement est lancé. S’il ne répond pas sous 8 jours, ou s’il infirme sa commande, celle-ci est annulée <b>(5)</b>. De même, si le réapprovisionnement n’est pas possible sous 3 semaines, la commande est annulée.</p><p>Le sous-processus de réapprovisionnement n’est pas détaillé (il fera l’objet d’une modélisation par le service concerné et sert aussi à d’autres processus). Il se termine lorsque tous les produits attendus sont reçus <b>(6)</b>, et le processus continue alors sur le chemin de fabrication classique. Pour éviter que le processus ne reste figé, un délai de 3 semaines se déclenche sur le sous-processus sans l’interrompre <b>(7)</b> : le service approvisionnement relance alors les fournisseurs en attente <b>(8)</b>, puis décide d’annuler ou non la commande du client <b>(9)</b>. S’il annule, un signal d’annulation des réapprovisionnements en cours est émis et on passe à l’annulation de la commande ; sinon, on laisse le sous-processus de réapprovisionnement se poursuivre <b>(10)</b>.</p>` },
      { type: 't2b', id: 'exam-ex2', title: 'Exercice 2 — Domi’Hut, texte → logigramme (20 pts)', level: 'Examen', diagrams: ['domiA', 'domiB'],
        text: `<p><i>Énoncé reformulé à partir de l’annale.</i> Mr Smith dirige Domi’Hut, une petite marque de livraison de pizzas (4 points de vente autour de Lyon, 2 ouvertures par an). Pour former ses futurs managers, il veut modéliser le processus principal « <b>Livraison de pizza</b> ». <b>Lis bien tout l’énoncé avant de commencer à dessiner !</b></p>
<p>Dans chaque point de vente, un employé peut tenir le rôle d’<b>Accueil</b>, de <b>Manager</b>, de <b>Pizzaiolo</b> ou de <b>Livreur</b> (les livreurs sont des employés de Domi’Hut ; pas de plateformes de livraison). On n’oublie pas de modéliser le <b>client</b> pour dessiner les messages échangés, mais son comportement interne ne nous intéresse pas.</p>
<p>Les pizzas sont soit <b>à emporter</b>, soit <b>livrées</b> à une adresse située à moins de 4 km du point de vente.</p>
<p>Quand une commande arrive, l’accueil demande si elle est à emporter ou à livrer, ainsi qu’un numéro de téléphone (même pour une vente à emporter). Pour une livraison, on demande l’adresse. Si elle est dans un rayon de 4 km, on poursuit la commande. Sinon, on vérifie si un autre point de vente est à moins de 4 km ; si oui, on propose au client de <b>transférer l’appel</b>. Si le client refuse — ou si aucun point de vente ne convient — on lui propose la <b>vente à emporter</b>. S’il refuse, la conversation s’arrête.</p>
<p>Si la commande se poursuit, on demande les pizzas et boissons voulues et on vérifie qu’elles sont <b>sur la carte</b>. Pour un produit hors carte, on propose au client de changer ; s’il refuse, la conversation s’arrête.</p>
<p>Sinon, la commande est <b>enregistrée</b> et passée à un pizzaiolo. Le <b>sous-processus de préparation</b> se déroule en étapes : pâte (à partir d’un pâton), choix de la sauce, étalage des ingrédients. Si <b>pendant une préparation</b> le pizzaiolo voit qu’un ingrédient va bientôt manquer, il en informe le manager qui <b>réapprovisionne</b> la cuisine. Après la préparation, la pizza est <b>enfournée 5 min</b>. Les pizzas d’une même commande sont préparées par le même pizzaiolo <b>les unes après les autres</b>. À la sortie du four, il place la pizza dans un carton. Le manager <b>édite le ticket</b> de vente et finalise la commande en y ajoutant les <b>boissons</b>.</p>
<p>Pour une vente à emporter, la commande est mise en attente : <b>soit</b> le client vient la chercher, <b>soit au bout de 2 heures</b> les boissons sont rangées et les pizzas détruites (qualité et hygiène).</p>
<p>Pour une livraison, la commande est confiée à un livreur. S’il arrive chez le client en <b>moins de 30 min</b>, il encaisse (CB ou espèces). Si plus de 30 min se sont écoulées et que le client demande un <b>rabais</b>, le livreur vérifie l’heure de commande sur le ticket : si les 30 min sont bien dépassées, il accorde <b>5 € de rabais par pizza</b> et encaisse ; sinon, il demande le paiement intégral. Si le client <b>conteste</b>, le livreur revient au point de vente avec la pizza et <b>signale l’incident au manager</b>, qui <b>bannit le client</b>.</p>`,
        steps: [
          Q('Comment structurer les participants ?', ['Une piscine Domi’Hut avec 4 couloirs (Accueil, Pizzaiolo, Manager, Livreur) + Client en boîte noire', 'Une piscine par employé', 'Une piscine Client détaillée + une piscine Domi’Hut', 'Une seule piscine, le client étant un couloir'], 0, 'Les 4 rôles sont internes (couloirs) ; le client est externe et non détaillé (boîte noire).'),
          Q('« Si l’adresse est à plus de 4 km… », « s’il refuse… » →', ['Passerelles exclusives', 'Passerelles parallèles', 'Passerelles inclusives', 'Évènements de frontière'], 0, 'Conditions de type si / sinon → exclusives, avec question et réponses libellées.', { svgOpts: ['gw-x', 'gw-par', 'gw-inc', 'boundary'] }),
          Q('Deux cas mènent à « proposer la vente à emporter » (refus du transfert, aucun point de vente). On…', ['Réunit les deux flux par une passerelle exclusive avant la tâche', 'Dessine deux fois la tâche', 'Utilise une parallèle de réunion', 'Utilise un signal'], 0, 'Une seule tâche, précédée d’une exclusive de réunion (parallèle = attendrait les deux, ce qui bloquerait).'),
          Q('« Les pizzas d’une même commande sont préparées par le même pizzaiolo les unes après les autres » →', ['Sous-processus « Préparation de la pizza » en multi-instance séquentielle (≡)', 'Multi-instance parallèle (|||)', 'Boucle sur toute la commande', 'Passerelle parallèle'], 0, 'Nombre connu (les pizzas de la commande), exécutées l’une après l’autre.', { svgOpts: ['multi-seq', 'multi-par', 'loop', 'gw-par'] }),
          Q('« Si pendant une préparation le pizzaiolo voit qu’un ingrédient va manquer, il informe le manager » →', ['Frontière NON-interruptive sur la préparation → tâche du manager', 'Frontière interruptive', 'Flux de message vers le manager', 'Passerelle exclusive après la préparation'], 0, 'La préparation continue (non-interruptif, pointillés). Le manager est dans la même piscine : flux de séquence.', { svgOpts: ['boundary-ni', 'boundary', 'flow-msg', 'gw-x'] }),
          Q('« La pizza est enfournée 5 min » →', ['Tâche « Enfourner » puis timer intermédiaire « 5 min »', 'Départ timer', 'Passerelle évènementielle', 'Frontière timer interruptive'], 0, 'Un délai entre deux activités = timer intermédiaire.', { svgOpts: ['inter-timer', 'start-timer', 'gw-ev', 'boundary'] }),
          Q('« Soit le client vient la chercher, soit au bout de 2 heures… » →', ['Passerelle évènementielle : message « Arrivée du client » / timer « 2 h »', 'Passerelle exclusive', 'Passerelle inclusive', 'Deux processus séparés'], 0, 'On attend le premier des deux évènements.', { svgOpts: ['gw-ev', 'gw-x', 'gw-inc', 'gw-par'] }),
          Q('« Les boissons sont rangées et les pizzas détruites » →', ['Passerelle parallèle (division + réunion)', 'Passerelle exclusive', 'Passerelle inclusive', 'Une seule tâche suffit obligatoirement'], 0, 'Les deux actions sont faites (sans condition) : parallèle. (Une seule tâche « Ranger les boissons et détruire les pizzas » serait aussi acceptée.)'),
          Q('Le livreur « signale l’incident au manager » :', ['Flux de séquence du couloir Livreur vers le couloir Manager', 'Flux de message', 'Signal throw', 'Évènement de lien uniquement'], 0, 'Même piscine Domi’Hut → R1 : pas de message, flux de séquence.'),
          Q('Le diagramme devient immense. Pour le couper en deux pages proprement on utilise…', ['Des évènements de lien (« Vers préparation » throw → catch)', 'Un flux de message', 'Une nouvelle piscine', 'Un évènement de fin puis un nouveau départ'], 0, 'C’est exactement le rôle des liens : renvoi graphique sans impact sur le déroulé.', { svgOpts: ['link-throw', 'flow-msg', 'pool', 'end'] })
        ],
        checklist: [
          'Piscine Domi’Hut avec 4 couloirs : Accueil, Pizzaiolo, Manager, Livreur',
          'Client en boîte noire ; échanges uniquement par flux de message (R1/R2 respectées)',
          'Départ message (appel / commande du client)',
          'Demande type de vente + n° de téléphone, puis exclusive « Type de vente ? » (emporter / livraison)',
          'Livraison : demande d’adresse puis exclusive « ≤ 4 km ? »',
          '> 4 km : recherche d’un autre point de vente → proposition de transfert → transfert (fin)',
          'Refus du transfert ou aucun point de vente : réunion puis proposition de vente à emporter ; refus → fin',
          'Prise de commande pizzas + boissons et vérification de la carte',
          'Produit hors carte : proposition de changement ; refus → fin « conversation terminée »',
          'Enregistrement de la commande puis passage au pizzaiolo',
          'Sous-processus « Préparation de la pizza » (nom) en multi-instance séquentielle, étapes en annotation',
          'Frontière non-interruptive « ingrédient bientôt manquant » → manager réapprovisionne la cuisine → fin',
          'Enfourner + timer « 5 min » + sortir et mettre en carton',
          'Manager : édition du ticket + ajout des boissons (finalisation)',
          'Exclusive selon le type de vente (à emporter / livraison)',
          'À emporter : évènementielle « Arrivée du client » / timer « 2 h »',
          '2 h écoulées : ranger les boissons ET détruire les pizzas (parallèle) → fin',
          'Livraison : livreur ; ≤ 30 min → encaissement CB ou espèces → fin',
          '> 30 min + demande de rabais : vérifier le ticket → rabais 5 €/pizza ou paiement intégral',
          'Contestation : retour au point de vente, signalement au manager (flux de séquence), bannissement → fin'
        ] }
    ]
  }
];
