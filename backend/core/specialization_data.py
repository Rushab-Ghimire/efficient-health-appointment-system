

SPECIALIZATION_DESCRIPTIONS = {
    
    "Cardiology": {
        "core_focus": "Heart and blood vessels (Cardiovascular system).",
        "conditions_treated": [
            "Coronary artery disease", "Heart failure", "Hypertension (high blood pressure)",
            "Arrhythmia", "High cholesterol", "Heart attack (Myocardial Infarction)", "Valvular heart disease"
        ],
        "symptoms_keywords": [
            "chest pain", "chest pressure", "shortness of breath", "palpitations", "fluttering heart",
            "racing heart", "irregular heartbeat", "dizziness", "fainting", "syncope", "swollen legs",
            "edema", "high blood pressure", "fatigue with exertion", "pain in arm or jaw"
        ],
        "procedures_tests": ["ECG", "EKG", "echocardiogram", "stress test", "cardiac catheterization", "stent"]
    },

    "Dermatology": {
        "core_focus": "Skin, hair, and nails.",
        "conditions_treated": [
            "Acne", "Eczema (Atopic Dermatitis)", "Psoriasis", "Warts", "Skin cancer", "Melanoma",
            "Rosacea", "Moles", "Fungal infections", "Alopecia (hair loss)"
        ],
        "symptoms_keywords": [
            "rash", "itchy skin", "pruritus", "changing mole", "new mole", "skin lesion", "skin growth",
            "hair loss", "bald patches", "nail discoloration", "brittle nails", "hives", "blisters",

            "dry skin", "acne", "pimples", "cysts"
        ],
        "procedures_tests": ["skin biopsy", "mole mapping", "cryotherapy", "light therapy"]
    },

    "ENT(Otolaryngology)": {
        "core_focus": "Ear, Nose, and Throat (ENT), and related head/neck structures.",
        "conditions_treated": [
            "Sinusitis (sinus infection)", "Hearing loss", "Tonsillitis", "Vertigo", "Sleep apnea",
            "Allergic rhinitis", "Thyroid disorders", "Voice disorders"
        ],
        "symptoms_keywords": [
            "sore throat", "sinus pain", "sinus pressure", "nasal congestion", "stuffy nose", "runny nose",
            "hearing loss", "muffled hearing", "ringing in ears", "tinnitus", "dizziness", "vertigo",
            "room spinning", "balance problems", "trouble swallowing", "dysphagia", "hoarseness", "losing voice",
            "snoring", "earache", "ear pain", "lump in neck"
        ],
        "procedures_tests": ["audiogram (hearing test)", "endoscopy", "laryngoscopy", "sleep study"]
    },
    
    "Gynecology": {
        "core_focus": "Female reproductive system health.",
        "patient_profile": "Female",
        "conditions_treated": [
            "Menstrual disorders", "Pelvic pain", "Uterine fibroids", "Ovarian cysts", "Endometriosis",
            "Vaginal infections (e.g., yeast infection)", "Cervical dysplasia", "Menopause"
        ],
        "symptoms_keywords": [
            "painful periods", "heavy periods", "irregular periods", "pelvic pain", "vaginal itching",
            "unusual discharge", "pain during intercourse", "birth control", "contraception", "pap smear",
            "menopause symptoms", "hot flashes", "pcos"
        ],
        "procedures_tests": ["Pap test", "pelvic exam", "ultrasound", "colposcopy", "IUD insertion"]
    },

    "Neurology": {
        "core_focus": "Nervous system (brain, spinal cord, nerves).",
        "conditions_treated": [
            "Migraine", "Headaches", "Epilepsy (seizures)", "Stroke", "Parkinson's disease",
            "Multiple Sclerosis (MS)", "Dementia", "Alzheimer's disease", "Neuropathy"
        ],
        "symptoms_keywords": [
            "headache", "migraine", "seizure", "numbness", "tingling", "pins and needles", "muscle weakness",
            "loss of coordination", "balance issues", "memory loss", "confusion", "tremors", "shaking",
            "dizziness", "slurred speech", "vision problems", "nerve pain", "sciatica"
        ],
        "procedures_tests": ["MRI", "CT scan", "EEG", "EMG", "lumbar puncture"]
    },
    
    "Orthopedics": {
        "core_focus": "Musculoskeletal system (bones, joints, ligaments, muscles).",
        "conditions_treated": [
            "Bone fractures", "Sports injuries", "ACL tear", "Torn meniscus", "Arthritis (Osteoarthritis)",
            "Back pain", "Carpal tunnel syndrome", "Tendonitis", "Rotator cuff tear"
        ],
        "symptoms_keywords": [
            "joint pain", "knee pain", "shoulder pain", "hip pain", "back pain", "broken bone", "fracture",
            "sprain", "strain", "swollen joint", "limited range of motion", "clicking joint", "popping joint",
            "numbness in hand", "sports injury"
        ],
        "procedures_tests": ["X-ray", "MRI", "joint replacement surgery", "arthroscopy"]
    },
    
    "Pediatrics": {
        "core_focus": "Medical care for infants, children, and adolescents.",
        "patient_profile": "Birth to age 18",
        "conditions_treated": [
            "Childhood illnesses", "Ear infections (Otitis Media)", "Asthma", "Developmental delays",
            "ADHD", "Common cold and flu"
        ],
        "symptoms_keywords": [
            "fever", "cough", "rash", "vomiting", "diarrhea", "earache", "sore throat",
            "vaccinations", "immunizations", "well-child check-up", "growth concerns",
            "developmental milestones", "my child", "my baby", "my son", "my daughter"
        ],
        "procedures_tests": ["vaccination shots", "developmental screening", "hearing and vision tests"]
    },

    "Physical Therapy": {
        "core_focus": "Rehabilitation to restore movement, function, and reduce pain.",
        "conditions_treated": [
            "Post-surgical recovery (e.g., knee replacement)", "Sports injuries", "Chronic pain",
            "Mobility issues", "Back and neck pain"
        ],
        "symptoms_keywords": [
            "rehab", "rehabilitation", "recovery after surgery", "improve mobility", "regain strength",
            "strengthening exercises", "physical therapy", "physiotherapy", "manage pain", "improve movement",
            "poor posture", "stiffness"
        ],
        "procedures_tests": ["therapeutic exercise", "manual therapy", "gait analysis"]
    },

    
    "Allergist": {
        "core_focus": "Allergies, asthma, and immune system disorders.",
        "conditions_treated": [
            "Allergic Rhinitis (Hay Fever)", "Asthma", "Food allergies", "Eczema", "Hives (Urticaria)",
            "Anaphylaxis"
        ],
        "symptoms_keywords": [
            "sneezing", "runny nose", "stuffy nose", "itchy eyes", "watery eyes", "hives", "allergic rash",
            "wheezing", "shortness of breath", "coughing", "food allergy", "pollen", "dust", "pet allergy", "seasonal allergies"
        ],
        "procedures_tests": ["skin prick test", "allergy blood test", "immunotherapy (allergy shots)"]
    },

    "General Physician": {
        "core_focus": "Primary point of contact for general and preventive healthcare.",
        "patient_profile": "All ages",
        "conditions_treated": [
            "Common cold", "Flu (Influenza)", "Diabetes management", "High blood pressure management",
            "General health check-ups", "Minor infections"
        ],
        "symptoms_keywords": [
            "check-up", "annual physical", "vaccination", "flu shot", "general wellness", "not feeling well",
            "prescription refill", "referral", "screening", "cold symptoms", "fever", "sore throat", "routine care"
        ],
        "procedures_tests": ["blood pressure check", "blood tests", "health screenings"]
    },
        "Oncology": {
        "core_focus": "Diagnosis and treatment of cancer and tumors.",
        "conditions_treated": [
            "Cancer", "Tumors", "Leukemia", "Lymphoma", "Melanoma", "Breast cancer", 
            "Lung cancer", "Colon cancer", "Prostate cancer", "Ovarian cancer"
        ],
        "symptoms_keywords": [
            "unexplained weight loss", "lump", "mass", "tumor", "persistent fatigue", 
            "night sweats", "coughing up blood", "blood in stool", "a sore that does not heal",
            "changes in bowel habits", "difficulty swallowing", "family history of cancer", 
            "cancer diagnosis", "chemotherapy", "radiation", "new lump", "painless lump"
        ],
        "procedures_tests": [
            "Biopsy", "Chemotherapy", "Radiation therapy", "Immunotherapy", 
            "Targeted therapy", "PET scan", "CT scan", "Tumor markers"
        ]
    },
}