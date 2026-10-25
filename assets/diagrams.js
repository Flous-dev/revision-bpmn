/* Diagrammes BPMN utilisés dans le site (redessinés à partir des TD, de l'annale et d'exercices originaux). */
window.DIAGRAMS = {

  /* TD1 – Ex2 : demande de remboursement */
  remb: {
    cw: 130, rh: 100,
    nodes: [
      { id: 's', t: 'start', m: 'message', c: 0, r: 0, l: 'Demande de remboursement' },
      { id: 't1', t: 'task', c: 1, r: 0, l: 'Vérifier dossier remboursement' },
      { id: 'g1', t: 'gw', g: '', c: 2, r: 0, l: 'Dossier existant ?', lpos: 'below' },
      { id: 'e1', t: 'end', m: 'message', c: 2, r: -1.05, l: 'Demande en cours', lpos: 'right' },
      { id: 't2', t: 'task', c: 3, r: 0, l: 'Créer dossier de remboursement' },
      { id: 't3', t: 'task', c: 4, r: 0, l: 'Vérifier somme demandée' },
      { id: 'g2', t: 'gw', g: '', c: 5, r: 0, l: 'Somme due ?' },
      { id: 't5', t: 'task', c: 6, r: 1, l: 'Décider du remboursement' },
      { id: 'g3', t: 'gw', g: 'x', c: 7, r: 1, l: 'Accepté ?', lpos: 'below' },
      { id: 't4', t: 'task', c: 7, r: 0, l: 'Rembourser la somme demandée' },
      { id: 'e2', t: 'end', m: 'message', c: 8, r: 0, l: 'Demande traitée' },
      { id: 't6', t: 'task', c: 8, r: 1, l: 'Clôturer dossier' },
      { id: 'e3', t: 'end', m: 'message', c: 9, r: 1, l: 'Demande refusée' }
    ],
    edges: [
      ['s', 't1'], ['t1', 'g1'], ['g1', 'e1', { l: 'OUI' }], ['g1', 't2', { l: 'NON' }], ['t2', 't3'], ['t3', 'g2'],
      ['g2', 't4', { l: '≤ 100 €' }], ['g2', 't5', { l: '> 100 €' }], ['t5', 'g3'], ['g3', 't4', { l: 'OUI' }],
      ['g3', 't6', { l: 'NON' }], ['t6', 'e3'], ['t4', 'e2']
    ]
  },

  /* TD2 – Ex2 : gestion des envois de colis */
  colis: {
    cw: 125, rh: 100,
    pools: [{ id: 'P', l: 'Envoi de colis', top: -0.55, bot: 3.55, lanes: [
      { l: 'Manager logistique', top: -0.55, bot: 0.55 },
      { l: 'Employé du bureau', top: 0.55, bot: 2.5 },
      { l: "Employé d'entrepôt", top: 2.5, bot: 3.55 }] }],
    nodes: [
      { id: 's', t: 'start', c: 0, r: 2, l: 'Produits à envoyer' },
      { id: 'p1', t: 'gw', g: '+', c: 1, r: 2 },
      { id: 't1', t: 'task', c: 2, r: 2, l: 'Faire appel ou non à un transporteur spécial', max: 17 },
      { id: 'gx', t: 'gw', g: 'x', c: 3, r: 2 },
      { id: 't2', t: 'task', c: 4, r: 1, l: 'Vérifier si une assurance est nécessaire', max: 17 },
      { id: 'go1', t: 'gw', g: 'o', c: 5, r: 1 },
      { id: 't3', t: 'task', c: 6, r: 0, l: 'Souscrire une assurance' },
      { id: 't4', t: 'task', c: 6, r: 1, l: 'Compléter le bordereau' },
      { id: 'go2', t: 'gw', g: 'o', c: 7, r: 1 },
      { id: 't5', t: 'task', c: 4.3, r: 2, l: 'Demander des devis aux transporteurs' },
      { id: 't6', t: 'task', c: 5.55, r: 2, l: 'Assigner un transporteur et préparer les documents', max: 17 },
      { id: 'gx2', t: 'gw', g: 'x', c: 8, r: 2 },
      { id: 't7', t: 'task', c: 4, r: 3, l: 'Emballer les produits' },
      { id: 'p2', t: 'gw', g: '+', c: 8, r: 3 },
      { id: 't8', t: 'task', c: 9, r: 3, l: 'Déplacer le colis dans la zone de sélection', max: 17 },
      { id: 'e', t: 'end', c: 10, r: 3, l: 'Marchandises disponibles' }
    ],
    edges: [
      ['s', 'p1'], ['p1', 't1'], ['p1', 't7'], ['t1', 'gx'], ['gx', 't2', { l: 'La poste standard' }], ['gx', 't5', { l: 'Transporteur spécial', max: 22 }],
      ['t2', 'go1'], ['go1', 't3', { l: 'Si assurance nécessaire', max: 12 }], ['go1', 't4', { l: 'Toujours' }], ['t3', 'go2'], ['t4', 'go2'],
      ['go2', 'gx2'], ['t5', 't6'], ['t6', 'gx2'], ['gx2', 'p2'], ['t7', 'p2'], ['p2', 't8'], ['t8', 'e']
    ]
  },

  /* TD1 – Ex3 : régulation de température */
  temp: {
    cw: 130, rh: 100,
    nodes: [
      { id: 's', t: 'start', m: 'condition', c: 0, r: 0, l: 'T° = 20 °C' },
      { id: 't1', t: 'task', c: 1, r: 0, l: 'Déclencher climatiseur' },
      { id: 'ti', t: 'inter', m: 'timer', c: 2, r: 0, l: '10 min', lpos: 'above' },
      { id: 't2', t: 'task', c: 3, r: 0, l: 'Prendre température salle' },
      { id: 'g', t: 'gw', g: '', c: 4, r: 0, l: 'T° ?', lpos: 'left' },
      { id: 'em', t: 'end', m: 'message', c: 5, r: -1, l: 'Notification responsable' },
      { id: 't3', t: 'task', c: 5, r: 0, l: 'Arrêter climatiseur' },
      { id: 'e', t: 'end', c: 6, r: 0, l: 'Fin régulation' }
    ],
    edges: [
      ['s', 't1'], ['t1', 'ti'], ['ti', 't2'], ['t2', 'g'], ['g', 'em', { l: '> 20 °' }], ['g', 't3', { l: '< 15 °' }], ['t3', 'e'],
      ['g', 'ti', { d: true, via: [[4, 0.78], [2, 0.78]], l: 'sinon (entre 15° et 20°)', max: 26 }]
    ]
  },

  /* TD2 – Ex3 : réservation au restaurant */
  resto: {
    cw: 122, rh: 105,
    nodes: [
      { id: 's', t: 'start', m: 'message', c: 0, r: 0, l: 'Demande de réservation' },
      { id: 't1', t: 'task', k: 'send', c: 1, r: 0, l: 'Demander nombre de personnes' },
      { id: 'i1', t: 'inter', m: 'message', c: 2, r: 0, l: 'Nombre de personnes' },
      { id: 'g1', t: 'gw', g: 'x', c: 3, r: 0, l: 'Nb ?', lpos: 'below' },
      { id: 't2', t: 'task', k: 'send', c: 4, r: -1, l: 'Transférer appel' },
      { id: 'e1', t: 'end', c: 5, r: -1, l: 'Réservation de groupe' },
      { id: 't3', t: 'task', k: 'send', c: 4, r: 0, l: 'Demander date et heure' },
      { id: 'i2', t: 'inter', m: 'message', c: 5, r: 0, l: 'Date et heure souhaitées' },
      { id: 'g2', t: 'gw', g: 'x', c: 6, r: 0, l: 'Date et heure ?', lpos: 'below' },
      { id: 'e2', t: 'end', m: 'message', c: 7, r: -1, l: 'Réservation refusée' },
      { id: 't4', t: 'task', k: 'user', c: 7, r: 0, l: 'Vérifier capacité place' },
      { id: 'g3', t: 'gw', g: 'x', c: 8, r: 0, l: 'Places dispo ?' },
      { id: 't5', t: 'task', k: 'send', c: 9, r: 0, l: 'Demander coordonnées' },
      { id: 'i3', t: 'inter', m: 'message', c: 10, r: 0, l: 'Coordonnées' },
      { id: 't6', t: 'task', k: 'user', c: 11, r: 0, l: 'Enregistrer réservation' },
      { id: 'e3', t: 'end', m: 'message', c: 12, r: 0, l: 'Réservation enregistrée' },
      { id: 't7', t: 'task', k: 'send', c: 8, r: 1.15, l: 'Demander une autre date' },
      { id: 'i4', t: 'inter', m: 'message', c: 7, r: 1.15, l: 'Choix du client' },
      { id: 'g4', t: 'gw', g: 'x', c: 6, r: 1.15, l: 'Autre date ?', lpos: 'left' },
      { id: 'e4', t: 'end', m: 'message', c: 6, r: 2.1, l: 'Réservation abandonnée', lpos: 'right' }
    ],
    edges: [
      ['s', 't1'], ['t1', 'i1'], ['i1', 'g1'], ['g1', 't2', { l: '> 8 personnes' }], ['t2', 'e1'], ['g1', 't3', { l: '≤ 8', d: true }],
      ['t3', 'i2'], ['i2', 'g2'], ['g2', 'e2', { l: '< 1 h avant le service', max: 14 }], ['g2', 't4', { l: 'Délai OK' }], ['t4', 'g3'],
      ['g3', 't5', { l: 'OUI' }], ['g3', 't7', { l: 'NON' }], ['t5', 'i3'], ['i3', 't6'], ['t6', 'e3'],
      ['t7', 'i4'], ['i4', 'g4'], ['g4', 't3', { l: 'OUI', via: [[4, 1.15]] }], ['g4', 'e4', { l: 'NON' }]
    ]
  },

  /* TD2 – Ex1 : gestion des emprunts (bibliothèque) */
  biblio: {
    cw: 125, rh: 100,
    nodes: [
      { id: 's', t: 'start', m: 'message', c: 0, r: 0, l: "Demande d'emprunt", bl: 'm' },
      { id: 't1', t: 'task', k: 'user', c: 1, r: 0, l: 'Rechercher adhérent', bl: 'lbl' },
      { id: 'g1', t: 'gw', g: 'x', c: 2, r: 0, l: 'Adhérent existant ?', bl: 'g' },
      { id: 'sp1', t: 'sub', c: 3, r: 1, l: "Création d'un adhérent", bl: 'lbl' },
      { id: 'g2', t: 'gw', g: 'x', c: 4, r: 0 },
      { id: 'sp2', t: 'sub', c: 5, r: 0, l: "Validation d'un emprunt", bl: 'lbl' },
      { id: 'g3', t: 'gw', g: 'x', c: 6, r: 0, l: 'Emprunt possible ?' },
      { id: 'e1', t: 'end', m: 'message', c: 6, r: 1, l: 'Emprunt impossible', lpos: 'right' },
      { id: 't2', t: 'task', k: 'user', c: 7, r: 0, l: 'Enregistrer emprunt', bl: 'lbl' },
      { id: 'ge', t: 'gw', g: 'ev', c: 8, r: 0, bl: 'g' },
      { id: 'i1', t: 'inter', m: 'message', c: 9, r: -0.6, l: 'Retour emprunt', lpos: 'above', bl: 'm' },
      { id: 'i2', t: 'inter', m: 'timer', c: 9, r: 0.6, l: '1 mois', bl: 'm' },
      { id: 't3', t: 'task', k: 'user', c: 10, r: -0.6, l: 'Enregistrer retour', bl: 'lbl' },
      { id: 'sp3', t: 'sub', c: 10, r: 0.6, l: 'Gestion litige', bl: 'lbl' },
      { id: 'e2', t: 'end', c: 11, r: -0.6, l: 'Fin emprunt' },
      { id: 'e3', t: 'end', c: 11, r: 0.6, l: 'Fin emprunt litige' }
    ],
    edges: [
      ['s', 't1'], ['t1', 'g1'], ['g1', 'sp1', { l: 'NON' }], ['g1', 'g2', { l: 'OUI' }], ['sp1', 'g2'], ['g2', 'sp2'], ['sp2', 'g3'],
      ['g3', 'e1', { l: 'NON' }], ['g3', 't2', { l: 'OUI' }], ['t2', 'ge'], ['ge', 'i1'], ['ge', 'i2'], ['i1', 't3'], ['i2', 'sp3'],
      ['t3', 'e2'], ['sp3', 'e3']
    ]
  },

  /* TD2 – Ex5 : Pack&Send */
  pack: {
    cw: 125, rh: 100,
    pools: [{ id: 'P', l: 'Gestion des expéditions de colis', top: -0.62, bot: 2.25, lanes: [
      { l: 'Service logistique', top: -0.62, bot: 0.55 },
      { l: 'Service administratif', top: 0.55, bot: 2.25 }] }],
    nodes: [
      { id: 's', t: 'start', m: 'message', c: 0, r: 0, l: 'Demande de préparation de colis', bl: 'm' },
      { id: 't1', t: 'task', c: 1, r: 0, l: 'Collecter les produits', bl: 'lbl' },
      { id: 't2', t: 'task', c: 2, r: 0, l: 'Emballer les produits', bl: 'lbl' },
      { id: 't3', t: 'task', c: 3, r: 1, l: 'Analyser la commande', bl: 'lbl' },
      { id: 'g', t: 'gw', g: 'x', c: 4, r: 1, l: 'Montant commande ?', bl: 'g' },
      { id: 't4', t: 'task', c: 5, r: 1, l: 'Souscrire une assurance', bl: 'lbl' },
      { id: 't5', t: 'task', c: 6, r: 1, l: "Éditer les documents d'expédition", bl: 'lbl' },
      { id: 't6', t: 'task', c: 7, r: 0, l: 'Finaliser le colis', bl: 'lbl' },
      { id: 't7', t: 'task', c: 8, r: 0, l: 'Expédier le colis', bl: 'lbl' },
      { id: 'e', t: 'end', c: 9, r: 0, l: 'Colis expédié' }
    ],
    edges: [
      ['s', 't1'], ['t1', 't2'], ['t2', 't3'], ['t3', 'g'], ['g', 't4', { l: '≥ 500 €' }],
      ['g', 't5', { l: '< 500 €', via: [[4, 1.75], [6, 1.75]] }], ['t4', 't5'], ['t5', 't6'], ['t6', 't7'], ['t7', 'e']
    ]
  },

  /* Révision – Ex2 : cabinet médical (diagramme de collaboration) */
  cabinet: {
    cw: 125, rh: 95,
    pools: [
      { id: 'PAT', l: 'PATIENT', top: -2.75, bot: -2.05, black: true },
      { id: 'C', l: 'Consultation', top: -1.75, bot: 3.6, lanes: [
        { l: 'Secrétariat', top: -1.75, bot: 1.45 },
        { l: 'Médecin', top: 1.45, bot: 3.6 }] },
      { id: 'SECU', l: 'SÉCURITÉ SOCIALE', top: 3.9, bot: 4.6, black: true }
    ],
    nodes: [
      { id: 's', t: 'start', m: 'message', c: 0, r: 0, l: 'Visite' },
      { id: 't1', t: 'task', c: 1, r: 0, l: 'Vérifier existence dossier' },
      { id: 'g1', t: 'gw', g: 'x', c: 2, r: 0, l: 'Dossier existant ?' },
      { id: 't2', t: 'task', k: 'user', c: 3, r: 0, l: 'Créer dossier' },
      { id: 't3', t: 'task', k: 'user', c: 3, r: 0.95, l: 'Compléter dossier' },
      { id: 'g2', t: 'gw', g: 'x', c: 4, r: 0 },
      { id: 'p1', t: 'gw', g: '+', c: 4, r: 2.1 },
      { id: 'sp', t: 'sub', c: 5, r: 2.1, l: 'Examen médical' },
      { id: 't4', t: 'task', k: 'user', c: 5, r: 3.0, l: 'Compléter dossier' },
      { id: 'p2', t: 'gw', g: '+', c: 6, r: 2.1 },
      { id: 't5', t: 'task', k: 'user', c: 7, r: 2.1, l: 'Créer ordonnance' },
      { id: 't6', t: 'task', k: 'user', c: 7, r: 0, l: 'Contrôler tiers payant' },
      { id: 'g3', t: 'gw', g: 'x', c: 8, r: 0, l: 'Tiers payant ?', lpos: 'below' },
      { id: 't7', t: 'task', k: 'user', c: 9, r: 0, l: 'Créer facture' },
      { id: 'e1', t: 'end', m: 'message', c: 10, r: 0, l: 'Facture', lpos: 'right' },
      { id: 'i1', t: 'inter', m: 'message', c: 9, r: -1, l: 'Paiement', lpos: 'below' },
      { id: 'e2', t: 'end', m: 'message', c: 10, r: -1, l: 'Volet facturation', lpos: 'right' }
    ],
    edges: [
      ['s', 't1'], ['t1', 'g1'], ['g1', 't2', { l: 'NON' }], ['g1', 't3', { l: 'OUI' }], ['t2', 'g2'], ['t3', 'g2'], ['g2', 'p1'],
      ['p1', 'sp'], ['p1', 't4'], ['sp', 'p2'], ['t4', 'p2'], ['p2', 't5'], ['t5', 't6'], ['t6', 'g3'],
      ['g3', 't7', { l: 'OUI' }], ['g3', 'i1', { l: 'NON' }], ['t7', 'e1'], ['i1', 'e2'],
      ['PAT', 's', { k: 'm' }], ['sp', 'PAT', { k: 'm', dx: -20 }], ['PAT', 'sp', { k: 'm', dx: 20 }],
      ['PAT', 'i1', { k: 'm' }], ['e2', 'PAT', { k: 'm' }], ['e1', 'SECU', { k: 'm' }]
    ]
  },

  /* Révision – Ex1 : processus d'embauche */
  embauche: {
    cw: 122, rh: 95,
    pools: [
      { id: 'E', l: 'Embauche : entretiens', top: -1.45, bot: 2.55, lanes: [
        { l: 'Service RH', top: -1.45, bot: 0.5 },
        { l: 'Interviewer 1', top: 0.5, bot: 1.5 },
        { l: 'Interviewer 2', top: 1.5, bot: 2.55 }] },
      { id: 'CAND', l: 'CANDIDAT', top: 2.85, bot: 3.55, black: true }
    ],
    nodes: [
      { id: 's', t: 'start', m: 'condition', c: 0, r: 0, l: 'Candidat retenu' },
      { id: 't1', t: 'task', c: 1, r: 0, l: 'Choisir 2 interviewers' },
      { id: 't2', t: 'task', k: 'service', c: 2, r: 0, l: "Demander à l'interviewer 1 de contacter le candidat", max: 17, h: 70 },
      { id: 't3', t: 'task', k: 'send', c: 3, r: 1, l: 'Contacter le candidat' },
      { id: 'sp1', t: 'sub', c: 4, r: 1, l: 'Entretien' },
      { id: 't4', t: 'task', k: 'user', c: 5, r: 1, l: 'Remplir formulaire' },
      { id: 'g1', t: 'gw', g: 'x', c: 6, r: 0, l: 'Entretien réussi ?', lpos: 'left' },
      { id: 'e1', t: 'end', m: 'message', c: 6.55, r: -0.9, l: "Échec de l'entretien", lpos: 'right' },
      { id: 't5', t: 'task', k: 'service', c: 7.3, r: 0, l: "Demander à l'interviewer 2 de contacter le candidat", max: 17, h: 70 },
      { id: 't6', t: 'task', k: 'send', c: 8.3, r: 2, l: 'Contacter le candidat' },
      { id: 'sp2', t: 'sub', c: 9.3, r: 2, l: 'Entretien' },
      { id: 't7', t: 'task', k: 'user', c: 10.3, r: 2, l: 'Remplir formulaire' },
      { id: 'g2', t: 'gw', g: 'x', c: 11.3, r: 0, l: 'Entretien réussi ?', lpos: 'left' },
      { id: 'e2', t: 'end', m: 'message', c: 11.85, r: -0.9, l: "Échec de l'entretien", lpos: 'right' },
      { id: 'e3', t: 'end', m: 'message', c: 12.3, r: 0, l: 'Embauche du candidat', lpos: 'right' }
    ],
    edges: [
      ['s', 't1'], ['t1', 't2'], ['t2', 't3'], ['t3', 'sp1'], ['sp1', 't4'], ['t4', 'g1'], ['g1', 'e1', { l: 'NON' }], ['g1', 't5', { l: 'OUI' }],
      ['t5', 't6'], ['t6', 'sp2'], ['sp2', 't7'], ['t7', 'g2'], ['g2', 'e2', { l: 'NON' }], ['g2', 'e3', { l: 'OUI' }],
      ['t3', 'CAND', { k: 'm' }], ['sp1', 'CAND', { k: 'm', dx: -20 }], ['CAND', 'sp1', { k: 'm', dx: 20 }], ['e1', 'CAND', { k: 'm' }],
      ['t6', 'CAND', { k: 'm' }], ['sp2', 'CAND', { k: 'm', dx: -20 }], ['CAND', 'sp2', { k: 'm', dx: 20 }], ['e2', 'CAND', { k: 'm' }], ['e3', 'CAND', { k: 'm' }]
    ]
  },

  /* Annale 2024 – Ex1 : Cuisine&moi (logigramme complet) */
  cuisine: {
    cw: 122, rh: 90,
    hl: ['o1', 't6', 't7', 'o2', 't8', 'g2', 't9', 'lk2', 'i7', 'ge3', 'i8', 'i9', 'i10', 'lk3', 'spR', 'lk4', 'bt', 't10', 't11', 'g3', 'eR', 'iS', 'lk5', 'n1', 'n2'],
    nodes: [
      { id: 's', t: 'start', m: 'message', c: 0, r: 0, l: 'Commande client' },
      { id: 't1', t: 'task', k: 'user', c: 1, r: 0, l: 'Enregistrer commande' },
      { id: 't2', t: 'task', k: 'user', c: 2, r: 0, l: 'Vérifier stock & capacité' },
      { id: 'g1', t: 'gw', g: '', c: 3, r: 0, l: 'Stock et capacité ?', lpos: 'left' },
      { id: 'lk1', t: 'inter', m: 'link', throw: true, c: 3, r: -1, l: 'Vers annulation de la commande', lpos: 'right' },
      { id: 'p1', t: 'gw', g: '+', c: 4, r: 0 },
      { id: 't3', t: 'task', k: 'user', c: 5, r: -0.62, l: 'Créer ordre de confirmation' },
      { id: 't4', t: 'task', k: 'user', c: 5, r: 0.62, l: 'Réserver produits semi-finis' },
      { id: 'p2', t: 'gw', g: '+', c: 6, r: 0 },
      { id: 'i1', t: 'inter', m: 'message', throw: true, c: 7, r: 0, l: 'Ordre confirmation' },
      { id: 'ge1', t: 'gw', g: 'ev', c: 8, r: 0 },
      { id: 'i2', t: 'inter', m: 'message', c: 9, r: 0, l: 'Confirmation client' },
      { id: 'i3', t: 'inter', m: 'timer', c: 9, r: -1.2, l: '8 jours' },
      { id: 'i4', t: 'inter', m: 'message', c: 9, r: -2.4, l: 'Information client' },
      { id: 'gA', t: 'gw', g: '', c: 10, r: -2.4 },
      { id: 'lkA', t: 'inter', m: 'link', c: 10, r: -3.4, l: 'Vers annulation de la commande', lpos: 'right' },
      { id: 'oA', t: 'gw', g: 'o', c: 11, r: -2.4 },
      { id: 'tA1', t: 'task', k: 'user', c: 12, r: -3.05, l: 'Enregistrer annulation' },
      { id: 'tA2', t: 'task', k: 'user', c: 12, r: -1.8, l: 'Remettre en stock produits' },
      { id: 'iN', t: 'inter', m: 'message', throw: true, c: 13, r: -3.05, l: 'Notification annulation', lpos: 'above' },
      { id: 'oB', t: 'gw', g: 'o', c: 14, r: -2.4 },
      { id: 'eA', t: 'end', c: 15, r: -2.4, l: 'Commande annulée' },
      { id: 'gF', t: 'gw', g: '', c: 10, r: 0 },
      { id: 'lkF', t: 'inter', m: 'link', c: 10, r: 1, l: 'Vers fabrication', lpos: 'right' },
      { id: 'p3', t: 'gw', g: '+', c: 11, r: 0 },
      { id: 't5', t: 'task', k: 'user', c: 12, r: -0.62, l: 'Créer facture' },
      { id: 'spA', t: 'sub', c: 12, r: 0.62, l: 'Assemblage' },
      { id: 'p4', t: 'gw', g: '+', c: 13, r: 0 },
      { id: 'spL', t: 'sub', c: 14, r: 0, l: 'Livraison' },
      { id: 'ge2', t: 'gw', g: 'ev', c: 15, r: 0 },
      { id: 'i5', t: 'inter', m: 'message', c: 16, r: 0, l: 'Règlement', lpos: 'above' },
      { id: 'i6', t: 'inter', m: 'timer', c: 16, r: 1, l: '15 jours' },
      { id: 'spT', t: 'sub', c: 17, r: 0, l: 'Traitement comptable' },
      { id: 'spG', t: 'sub', c: 17, r: 1, l: 'Gestion contentieux' },
      { id: 'eF', t: 'end', c: 18, r: 0, l: 'Commande terminée' },
      // Branche « Capacité OK ET Stock KO »
      { id: 'o1', t: 'gw', g: 'o', c: 4, r: 4 },
      { id: 't6', t: 'task', k: 'user', c: 5, r: 3.38, l: 'Réserver produits semi-finis en stock' },
      { id: 't7', t: 'task', multi: 'par', c: 5, r: 4.62, l: 'Demander délai réappro fournisseur' },
      { id: 'o2', t: 'gw', g: 'o', c: 6, r: 4 },
      { id: 't8', t: 'task', k: 'user', c: 7, r: 4, l: 'Vérifier délai appro' },
      { id: 'g2', t: 'gw', g: '', c: 8, r: 4, l: 'Délai réappro ?' },
      { id: 'lk2', t: 'inter', m: 'link', throw: true, c: 8, r: 5.1, l: 'Vers annulation de la commande', lpos: 'right' },
      { id: 't9', t: 'task', k: 'user', c: 9, r: 4, l: 'Créer ordre de confirmation' },
      { id: 'i7', t: 'inter', m: 'message', throw: true, c: 10, r: 4, l: 'Ordre confirmation' },
      { id: 'ge3', t: 'gw', g: 'ev', c: 11, r: 4 },
      { id: 'i8', t: 'inter', m: 'message', c: 12, r: 4, l: 'Confirmation client' },
      { id: 'i9', t: 'inter', m: 'timer', c: 12, r: 3.1, l: '8 jours', lpos: 'above' },
      { id: 'i10', t: 'inter', m: 'message', c: 12, r: 2.3, l: 'Information client', lpos: 'above' },
      { id: 'lk3', t: 'inter', m: 'link', throw: true, c: 13, r: 2.7, l: 'Vers annulation de la commande', lpos: 'right' },
      { id: 'spR', t: 'sub', multi: 'par', c: 13, r: 4, l: 'Réapprovisionnement', w: 126 },
      { id: 'lk4', t: 'inter', m: 'link', throw: true, c: 14, r: 4, l: 'Vers fabrication', lpos: 'right' },
      { id: 'bt', t: 'inter', m: 'timer', on: 'spR', side: 'b', off: -40, ni: true, l: '3 semaines', lpos: 'left' },
      { id: 't10', t: 'task', multi: 'par', c: 14, r: 5.3, l: 'Relancer fournisseurs' },
      { id: 't11', t: 'task', k: 'rule', c: 15, r: 5.3, l: "Décider d'annuler la commande" },
      { id: 'g3', t: 'gw', g: '', c: 16, r: 5.3, l: 'Décision' },
      { id: 'eR', t: 'end', c: 16, r: 6.3 },
      { id: 'iS', t: 'inter', m: 'signal', throw: true, c: 17, r: 5.3, l: 'Annulation réappro', lpos: 'above' },
      { id: 'lk5', t: 'inter', m: 'link', throw: true, c: 18, r: 5.3, l: 'Vers annulation de la commande' },
      { id: 'n1', t: 'note', c: 11.1, r: 5.55, l: 'Évènement non-interruptif', max: 16 },
      { id: 'n2', t: 'note', c: 16.6, r: 6.55, l: "Ce signal sera capté par un sous-processus évènementiel interruptif du sous-processus Réapprovisionnement, déclenchant l'annulation des réappros en cours.", max: 34 }
    ],
    edges: [
      ['s', 't1'], ['t1', 't2'], ['t2', 'g1'], ['g1', 'lk1', { l: 'Capacité KO' }], ['g1', 'p1', { l: 'Stock OK ET Capacité OK', max: 13 }],
      ['g1', 'o1', { l: 'Capacité OK ET Stock KO', route: 'v', hl: true, max: 13, lp: [0, 6] }],
      ['p1', 't3'], ['p1', 't4'], ['t3', 'p2'], ['t4', 'p2'], ['p2', 'i1'], ['i1', 'ge1'], ['ge1', 'i2'], ['ge1', 'i3'], ['ge1', 'i4'],
      ['i4', 'gA'], ['i3', 'gA'], ['lkA', 'gA'], ['gA', 'oA'], ['oA', 'tA1'], ['oA', 'tA2'], ['tA1', 'iN'], ['iN', 'oB'], ['tA2', 'oB'], ['oB', 'eA'],
      ['i2', 'gF'], ['lkF', 'gF'], ['gF', 'p3'], ['p3', 't5'], ['p3', 'spA'], ['t5', 'p4'], ['spA', 'p4'], ['p4', 'spL'], ['spL', 'ge2'],
      ['ge2', 'i5'], ['ge2', 'i6'], ['i5', 'spT'], ['i6', 'spG'], ['spT', 'eF'], ['spG', 'eF', { via: [[18, 1]] }],
      ['o1', 't6'], ['o1', 't7'], ['t6', 'o2'], ['t7', 'o2'], ['o2', 't8'], ['t8', 'g2'], ['g2', 't9', { l: '< 3 semaines', max: 8 }], ['g2', 'lk2', { d: true }],
      ['t9', 'i7'], ['i7', 'ge3'], ['ge3', 'i8'], ['ge3', 'i9'], ['ge3', 'i10'], ['i9', 'lk3'], ['i10', 'lk3'], ['i8', 'spR'], ['spR', 'lk4'],
      ['bt', 't10'], ['t10', 't11'], ['t11', 'g3'], ['g3', 'eR', { l: 'NON' }], ['g3', 'iS', { l: 'OUI' }], ['iS', 'lk5'],
      ['n1', 'bt', { k: 'a' }], ['n2', 'iS', { k: 'a' }]
    ]
  },

  /* Annale 2024 – Ex2 : Domi'Hut, partie 1 (prise de commande) — proposition de correction */
  domiA: {
    cw: 118, rh: 92,
    pools: [
      { id: 'CLI', l: 'CLIENT', top: -2.05, bot: -1.35, black: true },
      { id: 'D', l: "Domi'Hut — prise de commande", top: -1.05, bot: 4.75, lanes: [{ l: 'Accueil', top: -1.05, bot: 4.75 }] }
    ],
    nodes: [
      { id: 's', t: 'start', m: 'message', c: 0, r: 0, l: 'Appel client' },
      { id: 't1', t: 'task', k: 'send', c: 1, r: 0, l: 'Demander type de vente et n° de téléphone', max: 15, h: 70 },
      { id: 'i1', t: 'inter', m: 'message', c: 2, r: 0, l: 'Réponse client' },
      { id: 'g1', t: 'gw', g: 'x', c: 3, r: 0, l: 'Type de vente ?' },
      { id: 't2', t: 'task', k: 'send', c: 4, r: 1, l: "Demander l'adresse de livraison" },
      { id: 'i2', t: 'inter', m: 'message', c: 5, r: 1, l: 'Adresse' },
      { id: 'g2', t: 'gw', g: 'x', c: 6, r: 1, l: 'Distance ≤ 4 km ?' },
      { id: 't3', t: 'task', k: 'user', c: 6, r: 2.05, l: 'Rechercher un autre point de vente' },
      { id: 'g3', t: 'gw', g: 'x', c: 7, r: 2.05, l: 'Autre point de vente ≤ 4 km ?', lpos: 'above' },
      { id: 't4', t: 'task', k: 'send', c: 8, r: 2.05, l: "Proposer le transfert d'appel" },
      { id: 'i3', t: 'inter', m: 'message', c: 9, r: 2.05, l: 'Réponse client' },
      { id: 'g4', t: 'gw', g: 'x', c: 10, r: 2.05, l: 'Transfert accepté ?' },
      { id: 't5', t: 'task', c: 11, r: 2.05, l: "Transférer l'appel" },
      { id: 'e1', t: 'end', c: 12, r: 2.05, l: 'Appel transféré' },
      { id: 'gm_e', t: 'gw', g: 'x', c: 10, r: 3.1 },
      { id: 't6', t: 'task', k: 'send', c: 13, r: 3.1, l: 'Proposer la vente à emporter' },
      { id: 'i4', t: 'inter', m: 'message', c: 14, r: 3.1, l: 'Réponse client' },
      { id: 'g5', t: 'gw', g: 'x', c: 15, r: 3.1, l: 'Accepte ?', lpos: 'right' },
      { id: 'e2', t: 'end', c: 15, r: 4.1, l: 'Conversation terminée', lpos: 'right' },
      { id: 'gm1', t: 'gw', g: 'x', c: 15, r: 0 },
      { id: 't7', t: 'task', k: 'send', c: 16, r: 0, l: 'Demander pizzas et boissons' },
      { id: 'i5', t: 'inter', m: 'message', c: 17, r: 0, l: 'Commande du client' },
      { id: 't8', t: 'task', k: 'user', c: 18, r: 0, l: 'Vérifier les produits sur la carte' },
      { id: 'g6', t: 'gw', g: 'x', c: 19, r: 0, l: 'Produits à la carte ?' },
      { id: 't9', t: 'task', k: 'send', c: 19, r: 1.05, l: 'Proposer de changer de produit' },
      { id: 'i6', t: 'inter', m: 'message', c: 20, r: 1.05, l: 'Réponse client' },
      { id: 'g7', t: 'gw', g: 'x', c: 21, r: 1.05, l: 'Accepte de changer ?' },
      { id: 'e3', t: 'end', c: 21, r: 2.05, l: 'Conversation terminée', lpos: 'right' },
      { id: 'gm2', t: 'gw', g: 'x', c: 22, r: 0 },
      { id: 't10', t: 'task', k: 'user', c: 23, r: 0, l: 'Enregistrer la commande' },
      { id: 'lk', t: 'inter', m: 'link', throw: true, c: 24, r: 0, l: 'Vers préparation' }
    ],
    edges: [
      ['s', 't1'], ['t1', 'i1'], ['i1', 'g1'], ['g1', 'gm1', { l: 'À emporter' }], ['g1', 't2', { l: 'Livraison' }],
      ['t2', 'i2'], ['i2', 'g2'], ['g2', 'gm1', { l: 'OUI' }], ['g2', 't3', { l: 'NON' }], ['t3', 'g3'], ['g3', 't4', { l: 'OUI' }],
      ['t4', 'i3'], ['i3', 'g4'], ['g4', 't5', { l: 'OUI' }], ['t5', 'e1'], ['g4', 'gm_e', { l: 'NON' }], ['g3', 'gm_e', { l: 'NON', route: 'v' }],
      ['gm_e', 't6'], ['t6', 'i4'], ['i4', 'g5'], ['g5', 'gm1', { l: 'OUI' }], ['g5', 'e2', { l: 'NON' }],
      ['gm1', 't7'], ['t7', 'i5'], ['i5', 't8'], ['t8', 'g6'], ['g6', 'gm2', { l: 'OUI' }], ['g6', 't9', { l: 'NON' }],
      ['t9', 'i6'], ['i6', 'g7'], ['g7', 'gm2', { l: 'OUI' }], ['g7', 'e3', { l: 'NON' }], ['gm2', 't10'], ['t10', 'lk'],
      ['CLI', 's', { k: 'm' }], ['t1', 'CLI', { k: 'm' }], ['CLI', 'i1', { k: 'm' }], ['t2', 'CLI', { k: 'm' }], ['CLI', 'i2', { k: 'm' }],
      ['t4', 'CLI', { k: 'm' }], ['CLI', 'i3', { k: 'm' }], ['t6', 'CLI', { k: 'm' }], ['CLI', 'i4', { k: 'm' }],
      ['t7', 'CLI', { k: 'm' }], ['CLI', 'i5', { k: 'm' }], ['t9', 'CLI', { k: 'm', dx: 45 }], ['CLI', 'i6', { k: 'm' }]
    ]
  },

  /* Annale 2024 – Ex2 : Domi'Hut, partie 2 (préparation et livraison) — proposition de correction */
  domiB: {
    cw: 118, rh: 92,
    pools: [
      { id: 'D', l: "Domi'Hut — préparation et livraison", top: -1.3, bot: 7.75, lanes: [
        { l: 'Pizzaiolo', top: -1.3, bot: 0.7 },
        { l: 'Manager', top: 0.7, bot: 3.55 },
        { l: 'Livreur', top: 3.55, bot: 7.75 }] },
      { id: 'CLI', l: 'CLIENT', top: 8.05, bot: 8.75, black: true }
    ],
    nodes: [
      { id: 'lkc', t: 'inter', m: 'link', c: 0, r: 0, l: 'Vers préparation', lpos: 'above' },
      { id: 'spP', t: 'sub', multi: 'seq', c: 1, r: 0, l: 'Préparation de la pizza' },
      { id: 'btP', t: 'inter', m: 'condition', on: 'spP', side: 'b', ni: true, l: 'Ingrédient bientôt manquant', lpos: 'left' },
      { id: 'nP', t: 'note', c: 0.55, r: -0.88, l: "Pour chaque pizza, l'une après l'autre : préparer la pâte (pâton) → choisir la sauce → étaler les ingrédients", max: 44 },
      { id: 'tE', t: 'task', k: 'manual', c: 2, r: 0, l: 'Enfourner la pizza' },
      { id: 'iT', t: 'inter', m: 'timer', c: 3, r: 0, l: '5 min' },
      { id: 'tS', t: 'task', k: 'manual', c: 4, r: 0, l: 'Sortir la pizza et la mettre en carton', max: 15 },
      { id: 'tR', t: 'task', k: 'manual', c: 2, r: 1.65, l: 'Réapprovisionner la cuisine' },
      { id: 'eR', t: 'end', c: 3, r: 1.65, l: 'Cuisine réapprovisionnée' },
      { id: 'pM', t: 'gw', g: '+', c: 5, r: 1.6 },
      { id: 'tTk', t: 'task', k: 'user', c: 6, r: 1.15, l: 'Éditer le ticket de vente' },
      { id: 'tBo', t: 'task', k: 'manual', c: 6, r: 2.25, l: 'Ajouter les boissons' },
      { id: 'pM2', t: 'gw', g: '+', c: 7, r: 1.6 },
      { id: 'g8', t: 'gw', g: 'x', c: 8, r: 1.6, l: 'Type de vente ?' },
      { id: 'geW', t: 'gw', g: 'ev', c: 9, r: 1.6 },
      { id: 'i2h', t: 'inter', m: 'timer', c: 10, r: 1.15, l: '2 h', lpos: 'above' },
      { id: 'pD', t: 'gw', g: '+', c: 11, r: 1.15 },
      { id: 'tRg', t: 'task', k: 'manual', c: 12, r: 1.15, l: 'Ranger les boissons' },
      { id: 'tDe', t: 'task', k: 'manual', c: 12, r: 2.05, l: 'Détruire les pizzas' },
      { id: 'pD2', t: 'gw', g: '+', c: 13, r: 1.6 },
      { id: 'eD', t: 'end', c: 14, r: 1.6, l: 'Commande détruite' },
      { id: 'iC', t: 'inter', m: 'message', c: 10, r: 2.95, l: 'Arrivée du client', lpos: 'above' },
      { id: 'tRem', t: 'task', k: 'manual', c: 11, r: 2.95, l: 'Remettre la commande et encaisser', max: 15 },
      { id: 'eRem', t: 'end', c: 12, r: 2.95, l: 'Commande remise', lpos: 'right' },
      { id: 'tL', t: 'task', k: 'manual', c: 15, r: 4.3, l: 'Livrer la commande' },
      { id: 'g9', t: 'gw', g: 'x', c: 16, r: 4.3, l: 'Temps écoulé ?', lpos: 'below' },
      { id: 'g10', t: 'gw', g: 'x', c: 17, r: 4.3, l: 'Rabais demandé ?', lpos: 'above' },
      { id: 'gmE', t: 'gw', g: 'x', c: 21, r: 4.3 },
      { id: 'tEnc', t: 'task', k: 'user', c: 22, r: 4.3, l: 'Encaisser le client (CB ou espèces)' },
      { id: 'eL', t: 'end', c: 23, r: 4.3, l: 'Commande livrée' },
      { id: 'tV', t: 'task', k: 'manual', c: 17, r: 5.35, l: "Vérifier l'heure de commande sur le ticket", max: 15 },
      { id: 'g11', t: 'gw', g: 'x', c: 18, r: 5.35, l: '30 min dépassées ?', lpos: 'above' },
      { id: 'tRb', t: 'task', c: 19, r: 5.35, l: 'Accorder 5 € de rabais par pizza' },
      { id: 'tDm', t: 'task', k: 'send', c: 18, r: 6.4, l: 'Demander le paiement intégral' },
      { id: 'iRp', t: 'inter', m: 'message', c: 19, r: 6.4, l: 'Réponse client', lpos: 'above' },
      { id: 'g12', t: 'gw', g: 'x', c: 20, r: 6.4, l: 'Le client conteste ?', lpos: 'above' },
      { id: 'tRt', t: 'task', k: 'manual', c: 21, r: 7.15, l: "Revenir au point de vente et signaler l'incident", max: 16, h: 70 },
      { id: 'tBan', t: 'task', k: 'user', c: 24, r: 2.6, l: 'Bannir le client' },
      { id: 'eBan', t: 'end', c: 25, r: 2.6, l: 'Client banni' }
    ],
    edges: [
      ['lkc', 'spP'], ['spP', 'tE'], ['tE', 'iT'], ['iT', 'tS'], ['btP', 'tR'], ['tR', 'eR'], ['nP', 'spP', { k: 'a' }],
      ['tS', 'pM'], ['pM', 'tTk'], ['pM', 'tBo'], ['tTk', 'pM2'], ['tBo', 'pM2'], ['pM2', 'g8'], ['g8', 'geW', { l: 'À emporter', lp: [0, -2] }],
      ['geW', 'i2h'], ['geW', 'iC'], ['i2h', 'pD'], ['pD', 'tRg'], ['pD', 'tDe'], ['tRg', 'pD2'], ['tDe', 'pD2'], ['pD2', 'eD'],
      ['iC', 'tRem'], ['tRem', 'eRem'],
      ['g8', 'tL', { l: 'Livraison', route: 'v', via: [[8, 4.3]] }], ['tL', 'g9'],
      ['g9', 'g10', { l: '> 30 min' }], ['g9', 'gmE', { l: '≤ 30 min', la: 'end', lp: [-12, 0], via: [[16, 3.72], [21, 3.72]] }],
      ['g10', 'gmE', { l: 'NON' }], ['g10', 'tV', { l: 'OUI' }], ['tV', 'g11'], ['g11', 'tRb', { l: 'OUI' }], ['tRb', 'gmE'],
      ['g11', 'tDm', { l: 'NON' }], ['tDm', 'iRp'], ['iRp', 'g12'], ['g12', 'gmE', { l: 'NON' }], ['g12', 'tRt', { l: 'OUI', route: 'v' }],
      ['gmE', 'tEnc'], ['tEnc', 'eL'], ['tRt', 'tBan', { via: [[24, 7.15]] }], ['tBan', 'eBan'],
      ['CLI', 'iC', { k: 'm' }], ['CLI', 'tRem', { k: 'm' }], ['tDm', 'CLI', { k: 'm' }], ['CLI', 'iRp', { k: 'm' }], ['CLI', 'tEnc', { k: 'm' }]
    ]
  },

  /* Exercice original : location de vélos */
  velo: {
    cw: 125, rh: 95,
    pools: [
      { id: 'CLI', l: 'CLIENT', top: -2.3, bot: -1.6, black: true },
      { id: 'V', l: 'VéloCité — location', top: -1.3, bot: 2.75, lanes: [
        { l: 'Accueil', top: -1.3, bot: 0.75 },
        { l: 'Atelier', top: 0.75, bot: 2.75 }] }
    ],
    nodes: [
      { id: 's', t: 'start', m: 'message', c: 0, r: 0, l: 'Demande de location' },
      { id: 't1', t: 'task', k: 'user', c: 1, r: 0, l: 'Vérifier la disponibilité' },
      { id: 'g1', t: 'gw', g: 'x', c: 2, r: 0, l: 'Vélo disponible ?', lpos: 'below' },
      { id: 'e1', t: 'end', m: 'message', c: 2.55, r: -0.85, l: 'Refus de location', lpos: 'right' },
      { id: 'p1', t: 'gw', g: '+', c: 3, r: 0 },
      { id: 't2', t: 'task', k: 'user', c: 4, r: 0, l: 'Encaisser la caution' },
      { id: 't3', t: 'task', k: 'manual', c: 4, r: 1.75, l: 'Préparer le vélo' },
      { id: 'p2', t: 'gw', g: '+', c: 5, r: 0 },
      { id: 't4', t: 'task', k: 'send', c: 6, r: 0, l: 'Remettre le vélo au client' },
      { id: 'ge', t: 'gw', g: 'ev', c: 7, r: 0 },
      { id: 'iR', t: 'inter', m: 'message', c: 8.6, r: 1.75, l: 'Retour du vélo', lpos: 'above' },
      { id: 'iT', t: 'inter', m: 'timer', c: 8, r: 0, l: '48 h', lpos: 'above' },
      { id: 't9', t: 'task', k: 'user', c: 9.3, r: 0, l: 'Conserver la caution' },
      { id: 'e3', t: 'end', m: 'message', c: 10.3, r: 0, l: 'Caution encaissée' },
      { id: 't5', t: 'task', k: 'manual', c: 9.6, r: 1.75, l: "Contrôler l'état du vélo" },
      { id: 'o1', t: 'gw', g: 'o', c: 10.6, r: 1.75 },
      { id: 't6', t: 'task', k: 'manual', c: 11.6, r: 1.2, l: 'Nettoyer le vélo' },
      { id: 't7', t: 'task', k: 'user', c: 11.6, r: 2.3, l: 'Chiffrer les réparations' },
      { id: 'o2', t: 'gw', g: 'o', c: 12.6, r: 1.75 },
      { id: 't8', t: 'task', k: 'send', c: 13.6, r: 0, l: 'Restituer la caution (moins les réparations)', max: 15 },
      { id: 'e2', t: 'end', c: 14.6, r: 0, l: 'Location clôturée' }
    ],
    edges: [
      ['s', 't1'], ['t1', 'g1'], ['g1', 'e1', { l: 'NON' }], ['g1', 'p1', { l: 'OUI' }], ['p1', 't2'], ['p1', 't3'],
      ['t2', 'p2'], ['t3', 'p2'], ['p2', 't4'], ['t4', 'ge'], ['ge', 'iR', { route: 'v' }], ['ge', 'iT'], ['iT', 't9'], ['t9', 'e3'],
      ['iR', 't5'], ['t5', 'o1'], ['o1', 't6', { l: 'Toujours' }], ['o1', 't7', { l: 'Si dégâts' }], ['t6', 'o2'], ['t7', 'o2'],
      ['o2', 't8'], ['t8', 'e2'],
      ['CLI', 's', { k: 'm' }], ['e1', 'CLI', { k: 'm' }], ['t4', 'CLI', { k: 'm' }], ['CLI', 'iR', { k: 'm' }], ['e3', 'CLI', { k: 'm' }], ['t8', 'CLI', { k: 'm' }]
    ]
  },

  /* Exercice original : clinique vétérinaire (texte -> BPMN) */
  veto: {
    cw: 122, rh: 95,
    pools: [
      { id: 'PRO', l: 'PROPRIÉTAIRE', top: -1.75, bot: -1.05, black: true },
      { id: 'V', l: 'Clinique VétoPlus', top: -0.75, bot: 4.0, lanes: [
        { l: 'Accueil', top: -0.75, bot: 1.45 },
        { l: 'Vétérinaire', top: 1.45, bot: 4.0 }] }
    ],
    nodes: [
      { id: 's', t: 'start', m: 'message', c: 0, r: 0, l: 'Arrivée du propriétaire' },
      { id: 't1', t: 'task', k: 'user', c: 1, r: 0, l: "Rechercher la fiche de l'animal" },
      { id: 'g1', t: 'gw', g: 'x', c: 2, r: 0, l: 'Fiche existante ?' },
      { id: 'sp1', t: 'sub', c: 3, r: 0.95, l: 'Création de la fiche' },
      { id: 'g2', t: 'gw', g: 'x', c: 4, r: 0 },
      { id: 't2', t: 'task', k: 'manual', c: 5, r: 0, l: "Peser l'animal" },
      { id: 'sp2', t: 'sub', c: 6, r: 2.1, l: "Examen de l'animal" },
      { id: 'bt', t: 'inter', m: 'condition', on: 'sp2', side: 'b', l: 'Urgence vitale', lpos: 'left' },
      { id: 't3', t: 'task', k: 'manual', c: 7, r: 3.4, l: 'Transférer en soins intensifs' },
      { id: 'e1', t: 'end', c: 8, r: 3.4, l: 'Animal transféré', lpos: 'right' },
      { id: 'o1', t: 'gw', g: 'o', c: 7, r: 2.1, l: 'Soins ?', lpos: 'below' },
      { id: 't4', t: 'task', k: 'manual', c: 8, r: 1.75, l: "Vacciner l'animal" },
      { id: 't5', t: 'task', k: 'manual', c: 8, r: 2.6, l: 'Administrer le traitement', h: 58 },
      { id: 'o2', t: 'gw', g: 'o', c: 9, r: 2.1 },
      { id: 't6', t: 'task', k: 'user', c: 10, r: 2.1, l: "Rédiger l'ordonnance" },
      { id: 't7', t: 'task', k: 'user', c: 11, r: 0, l: 'Encaisser la consultation' },
      { id: 't8', t: 'task', k: 'send', c: 12, r: 0, l: "Remettre l'ordonnance et la facture", max: 15 },
      { id: 'iT', t: 'inter', m: 'timer', c: 13, r: 0, l: '7 jours' },
      { id: 't9', t: 'task', k: 'service', c: 14, r: 0, l: 'Envoyer un SMS de suivi' },
      { id: 'e2', t: 'end', c: 15, r: 0, l: 'Consultation clôturée' }
    ],
    edges: [
      ['s', 't1'], ['t1', 'g1'], ['g1', 'sp1', { l: 'NON' }], ['g1', 'g2', { l: 'OUI' }], ['sp1', 'g2'], ['g2', 't2'], ['t2', 'sp2'],
      ['bt', 't3'], ['t3', 'e1'], ['sp2', 'o1'], ['o1', 't4', { l: 'Vaccin' }], ['o1', 't5', { l: 'Traitement' }], ['t4', 'o2'], ['t5', 'o2'],
      ['o2', 't6'], ['t6', 't7'], ['t7', 't8'], ['t8', 'iT'], ['iT', 't9'], ['t9', 'e2'],
      ['PRO', 's', { k: 'm' }], ['t8', 'PRO', { k: 'm' }], ['t9', 'PRO', { k: 'm' }]
    ]
  }
};
