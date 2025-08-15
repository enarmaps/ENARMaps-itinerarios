document.addEventListener('DOMContentLoaded', function () {
    // --- CONFIGURACIÓN Y REFERENCIAS DEL DOM ---
    const form = document.getElementById('enarmForm');
    const formWrapper = document.getElementById('form-wrapper');
    const reportWrapper = document.getElementById('report-wrapper');
    const generateReportBtn = document.getElementById('generateReportBtn');
    const alertModal = document.getElementById('alertModal');
    const alertMessage = document.getElementById('alertMessage');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const temarioContainer = document.getElementById('temario-container');
    const specialtySelect = document.getElementById('target_specialty');
    const expRadio = document.querySelectorAll('input[name="previous_experience"]');
    const expDetails = document.getElementById('previous-experience-details');
    
    // Referencias para sección de simulacros dinámica
    const addSimDayBtn = document.getElementById('add-simulation-day-btn');
    const simDaysContainer = document.getElementById('simulation-days-container');

    const addPlatformBtn = document.getElementById('add-platform-btn');
    const platformInput = document.getElementById('platform_input');
    const platformTagsContainer = document.getElementById('platform-tags-container');
    const hoursSuggestionDiv = document.getElementById('hour    s-suggestion');
    const phoneInput = document.getElementById('telefono');
    const phoneValidationMessage = document.getElementById('phone-validation-message');
    let platforms = [];
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxdavCiuys19zOUpwT3Dwrxr8aexkC3zE2kh6CTwHFR-ZbxD8N9augO5mTyh3EVJz9R3Q/exec";

    // --- DATOS (TEMARIO Y ESPECIALIDADES) ---
    const temario = {
        "🏥 Medicina Interna": {
            "❤️ Cardiología": [
                { name: "Hipertensión arterial sistémica", priority: "Alta" },
                { name: "Insuficiencia cardíaca", priority: "Alta" },
                { name: "Cardiopatía isquémica", priority: "Alta" },
                { name: "Síndrome coronario agudo", priority: "Alta" },
                { name: "Fibrilación auricular", priority: "Alta" },
                { name: "Electrocardiograma (ECG)", priority: "Alta" },
                { name: "Arritmias cardíacas", priority: "Alta" },
                { name: "Síncope", priority: "Alta" },
                { name: "Taponamiento cardíaco", priority: "Media" },
                { name: "Disección aórtica", priority: "Media" },
                { name: "Pericarditis", priority: "Media" },
                { name: "Endocarditis infecciosa", priority: "Media" },
                { name: "Fiebre reumática", priority: "Media" },
                { name: "Valvulopatías", priority: "Media" },
                { name: "Hipertensión pulmonar", priority: "Media" },
                { name: "Miocardiopatías", priority: "Media" },
                { name: "Miocarditis", priority: "Baja" },
                { name: "Coartación aórtica", priority: "Baja" }
            ],
            "🔬 Endocrinología": [
                { name: "Diabetes mellitus tipo 2", priority: "Alta" },
                { name: "Diabetes mellitus tipo 1", priority: "Alta" },
                { name: "Cetoacidosis diabética", priority: "Alta" },
                { name: "Hipoglucemia", priority: "Alta" },
                { name: "Hipotiroidismo", priority: "Alta" },
                { name: "Hipertiroidismo", priority: "Alta" },
                { name: "Estado hiperglucémico hiperosmolar (EHH)", priority: "Alta" },
                { name: "Síndrome metabólico", priority: "Alta" },
                { name: "Dislipidemias", priority: "Alta" },
                { name: "Osteoporosis", priority: "Alta" },
                { name: "SIADH", priority: "Media" },
                { name: "Hiperparatiroidismo y hipoparatiroidismo", priority: "Media" },
                { name: "Acromegalia", priority: "Media" },
                { name: "Prolactinoma", priority: "Media" },
                { name: "Hiperaldosteronismo primario (Síndrome de Conn)", priority: "Media" },
                { name: "Cáncer de tiroides", priority: "Media" },
                { name: "Síndrome de Cushing", priority: "Baja" },
                { name: "Enfermedad de Addison", priority: "Baja" },
                { name: "Feocromocitoma", priority: "Baja" },
                { name: "Síndrome de Sheehan", priority: "Baja" },
                { name: "Síndrome de Turner", priority: "Baja" },
                { name: "Síndrome de Klinefelter", priority: "Baja" },
                { name: "Diabetes insípida", priority: "Baja" }
            ],
            "🫁 Neumología": [
                { name: "Asma bronquial", priority: "Alta" },
                { name: "EPOC", priority: "Alta" },
                { name: "Neumonía adquirida en la comunidad", priority: "Alta" },
                { name: "Neumotórax", priority: "Alta" },
                { name: "Embolia pulmonar", priority: "Alta" },
                { name: "Síndrome de dificultad respiratoria aguda (SDRA)", priority: "Alta" },
                { name: "Tuberculosis pulmonar", priority: "Alta" },
                { name: "Derrame pleural", priority: "Alta" },
                { name: "Cáncer de pulmón", priority: "Alta" },
                { name: "Apnea obstructiva del sueño (AOS)", priority: "Media" },
                { name: "Bronquiectasias", priority: "Baja" },
                { name: "Sarcoidosis", priority: "Baja" },
                { name: "Enfermedades pulmonares ocupacionales", priority: "Baja" },
                { name: "Fibrosis pulmonar", priority: "Baja" }
            ],
            "🍽️ Gastroenterología": [
                { name: "Enfermedad ácido péptica", priority: "Alta" },
                { name: "Gastritis", priority: "Alta" },
                { name: "Úlcera péptica", priority: "Alta" },
                { name: "Enfermedad por reflujo gastroesofágico", priority: "Alta" },
                { name: "Hepatitis viral", priority: "Alta" },
                { name: "Cirrosis hepática", priority: "Alta" },
                { name: "Enfermedad por hígado graso no alcohólico (EHGNA)", priority: "Alta" },
                { name: "Várices esofágicas", priority: "Alta" },
                { name: "Ascitis", priority: "Alta" },
                { name: "Pancreatitis aguda", priority: "Alta" },
                { name: "Hemorragia digestiva alta y baja", priority: "Alta" },
                { name: "Hepatocarcinoma", priority: "Alta" },
                { name: "Cáncer gástrico", priority: "Alta" },
                { name: "Síndrome de intestino irritable", priority: "Media" },
                { name: "Enfermedad inflamatoria intestinal", priority: "Media" },
                { name: "Enfermedad diverticular", priority: "Media" },
                { name: "Cáncer de páncreas", priority: "Media" },
                { name: "Enfermedad celíaca", priority: "Media" },
                { name: "Colitis ulcerosa", priority: "Media" },
                { name: "Enfermedad de Crohn", priority: "Media" },
                { name: "Hepatitis autoinmune", priority: "Baja" },
                { name: "Pancreatitis crónica", priority: "Baja" },
                { name: "Acalasia", priority: "Baja" }
            ],
            "🫘 Nefrología": [
                { name: "Lesión renal aguda", priority: "Alta" },
                { name: "Enfermedad renal crónica", priority: "Alta" },
                { name: "Trastornos del equilibrio ácido-base", priority: "Alta" },
                { name: "Nefropatía diabética", priority: "Alta" },
                { name: "Trastornos hidroelectrolíticos", priority: "Alta" },
                { name: "Síndrome nefrótico", priority: "Media" },
                { name: "Síndrome nefrítico", priority: "Media" },
                { name: "Glomerulonefritis", priority: "Media" },
                { name: "Nefritis lúpica", priority: "Media" },
                { name: "Enfermedad poliquística renal del adulto", priority: "Media" },
                { name: "Nefritis intersticial aguda y necrosis tubular aguda", priority: "Media" },
                { name: "Nefropatía por IgA (Enfermedad de Berger)", priority: "Media" },
                { name: "Glomerulonefritis postestreptocócica", priority: "Media" },
                { name: "Estenosis de la arteria renal", priority: "Media" }
            ],
            "🩸 Hematología": [
                { name: "Anemia ferropénica", priority: "Alta" },
                { name: "Anemias hemolíticas", priority: "Alta" },
                { name: "Anemia megaloblástica", priority: "Alta" },
                { name: "Enfermedad tromboembólica", priority: "Alta" },
                { name: "Anemia de enfermedad crónica", priority: "Media" },
                { name: "Leucemia mieloide aguda (LMA)", priority: "Media" },
                { name: "Leucemia mieloide crónica (LMC)", priority: "Media" },
                { name: "Linfoma de Hodgkin", priority: "Media" },
                { name: "Linfoma no Hodgkin", priority: "Media" },
                { name: "Mieloma múltiple", priority: "Media" },
                { name: "Síndromes mieloproliferativos (enfocado en Policitemia Vera)", priority: "Media" },
                { name: "Leucemia linfocítica crónica (LLC)", priority: "Media" },
                { name: "Trombocitopenia inmune primaria (PTI)", priority: "Media" },
                { name: "Púrpura trombocitopénica trombótica (PTT)", priority: "Media" },
                { name: "Talasemias", priority: "Baja" },
                { name: "Hemofilia", priority: "Baja" },
                { name: "Aplasia medular", priority: "Baja" },
                { name: "Trombofilias (estados de hipercoagulabilidad)", priority: "Baja" },
                { name: "Enfermedad de von Willebrand", priority: "Baja" }
            ],
            "🦴 Reumatología": [
                { name: "Artritis reumatoide", priority: "Alta" },
                { name: "Lupus eritematoso sistémico", priority: "Alta" },
                { name: "Osteoartritis", priority: "Alta" },
                { name: "Vasculitis por IgA (púrpura de Henoch-Schönlein)", priority: "Media" },
                { name: "Gota", priority: "Media" },
                { name: "Síndrome de Sjögren", priority: "Media" },
                { name: "Arteritis de células gigantes", priority: "Media" },
                { name: "Granulomatosis con poliangeítis (Wegener)", priority: "Media" },
                { name: "Síndrome antifosfolípido", priority: "Media" },
                { name: "Esclerodermia", priority: "Media" },
                { name: "Dermatomiositis", priority: "Media" },
                { name: "Arteritis de Takayasu", priority: "Baja" },
                { name: "Poliarteritis nodosa (PAN)", priority: "Baja" },
                { name: "Poliangeítis eosinofílica con granulomatosis (Churg-Strauss)", priority: "Baja" },
                { name: "Enfermedad por depósito de pirofosfato de calcio (pseudogota)", priority: "Baja" },
                { name: "Polimiositis", priority: "Baja" },
                { name: "Fibromialgia", priority: "Baja" },
                { name: "Espondiloartritis", priority: "Baja" },
                { name: "Síndrome de Marfan", priority: "Baja" }
            ],
            "🦠 Infectología": [
                { name: "Sepsis y choque séptico", priority: "Alta" },
                { name: "Infecciones de vías respiratorias", priority: "Alta" },
                { name: "Infecciones de vías urinarias", priority: "Alta" },
                { name: "Encefalitis", priority: "Alta" },
                { name: "Sífilis", priority: "Alta" },
                { name: "Gonorrea", priority: "Alta" },
                { name: "Infección por clamidia", priority: "Alta" },
                { name: "VIH/SIDA", priority: "Alta" },
                { name: "Tuberculosis", priority: "Alta" },
                { name: "Absceso cerebral", priority: "Media" },
                { name: "Infecciones de piel y tejidos blandos", priority: "Media" },
                { name: "Hepatitis virales", priority: "Media" },
                { name: "Fiebre de origen desconocido", priority: "Media" },
                { name: "Infección por SARS-CoV-2", priority: "Media" },
                { name: "Brucelosis", priority: "Media" },
                { name: "Fiebre tifoidea", priority: "Media" },
                { name: "Dengue", priority: "Media" },
                { name: "Infecciones nosocomiales", priority: "Baja" },
                { name: "Zika", priority: "Baja" },
                { name: "Chikungunya", priority: "Baja" },
                { name: "Paludismo (Malaria)", priority: "Baja" },
                { name: "Enfermedad de Chagas", priority: "Baja" },
                { name: "Leishmaniasis", priority: "Baja" }
            ]
        },
        "👶 Pediatría": {
            "👶 Neonatología": [
                { name: "Reanimación neonatal", priority: "Alta" },
                { name: "Síndrome de dificultad respiratoria", priority: "Alta" },
                { name: "Taquipnea transitoria del recién nacido", priority: "Alta" },
                { name: "Ictericia neonatal", priority: "Alta" },
                { name: "Sepsis neonatal", priority: "Alta" },
                { name: "Infecciones congénitas (TORCH)", priority: "Alta" },
                { name: "Hipoglucemia neonatal", priority: "Media" },
                { name: "Síndrome de aspiración de meconio", priority: "Media" },
                { name: "Hemorragia intraventricular", priority: "Media" },
                { name: "Enterocolitis necrotizante", priority: "Media" },
                { name: "Retinopatía del prematuro", priority: "Baja" },
                { name: "Persistencia del conducto arterioso", priority: "Baja" },
                { name: "Policitemia neonatal", priority: "Baja" },
                { name: "Otras cromosomopatías (Edwards T18, Patau T13)", priority: "Baja" }
            ],
            "📏 Crecimiento y Desarrollo": [
                { name: "Evaluación del crecimiento", priority: "Alta" },
                { name: "Desarrollo psicomotor e hitos clave", priority: "Alta" },
                { name: "Lactancia materna", priority: "Alta" },
                { name: "Desnutrición infantil", priority: "Alta" },
                { name: "Obesidad infantil", priority: "Media" },
                { name: "Alimentación complementaria", priority: "Media" },
                { name: "Talla baja", priority: "Media" },
                { name: "Raquitismo (deficiencia de vitamina D)", priority: "Media" },
                { name: "Tamiz neonatal", priority: "Media" },
                { name: "Maltrato infantil", priority: "Media" },
                { name: "Síndrome de Down (Trisomía 21)", priority: "Media" },
                { name: "Alergia alimentaria", priority: "Media" },
                { name: "Displasia del desarrollo de la cadera", priority: "Baja" },
                { name: "Pubertad retrasada", priority: "Baja" },
                { name: "Pubertad precoz", priority: "Baja" }
            ],
            "🦠 Infectología Pediátrica": [
                { name: "Infecciones respiratorias agudas", priority: "Alta" },
                { name: "Faringoamigdalitis estreptocócica", priority: "Alta" },
                { name: "Artritis séptica y osteomielitis", priority: "Alta" },
                { name: "Enfermedad diarreica aguda", priority: "Alta" },
                { name: "Otitis media aguda", priority: "Alta" },
                { name: "Tos ferina", priority: "Media" },
                { name: "Infección de vías urinarias pediátrica", priority: "Media" },
                { name: "Meningitis pediátrica", priority: "Media" },
                { name: "Exantemas virales", priority: "Media" },
                { name: "Mononucleosis infecciosa (virus de Epstein-Barr)", priority: "Baja" }
            ],
            "🔬 Endocrinología Pediátrica": [
                { name: "Diabetes mellitus tipo 1 pediátrica", priority: "Alta" },
                { name: "Cetoacidosis diabética pediátrica", priority: "Alta" },
                { name: "Hipotiroidismo congénito", priority: "Media" },
                { name: "Hiperplasia suprarrenal congénita", priority: "Baja" }
            ],
            "❤️ Cardiología Pediátrica": [
                { name: "Enfermedad de Kawasaki", priority: "Alta" },
                { name: "Fiebre reumática aguda", priority: "Alta" },
                { name: "Transposición de grandes vasos", priority: "Media" },
                { name: "Coartación aórtica", priority: "Media" },
                { name: "Soplos cardiacos", priority: "Media" },
                { name: "Comunicación interventricular", priority: "Media" },
                { name: "Taquicardia supraventricular", priority: "Media" },
                { name: "Comunicación interauricular", priority: "Baja" },
                { name: "Tetralogía de Fallot", priority: "Baja" }
            ],
            "🧠 Neurología Pediátrica": [
                { name: "Crisis convulsivas pediátricas", priority: "Alta" },
                { name: "Epilepsia pediátrica", priority: "Media" },
                { name: "Convulsiones febriles", priority: "Media" },
                { name: "Defectos del tubo neural (espina bífida, mielomeningocele)", priority: "Media" },
                { name: "Trastorno por déficit de atención e hiperactividad (TDAH)", priority: "Media" },
                { name: "Distrofia muscular de Duchenne", priority: "Baja" },
                { name: "Cefalea en pediatría", priority: "Baja" },
                { name: "Parálisis cerebral infantil", priority: "Baja" },
                { name: "Hidrocefalia", priority: "Baja" },
                { name: "Trastorno del espectro autista (TEA)", priority: "Baja" }
            ],
            "🩸 Hematología Pediátrica": [
                { name: "Anemia ferropénica pediátrica", priority: "Alta" },
                { name: "Anemia de células falciformes (drepanocitosis)", priority: "Alta" },
                { name: "Leucemia linfoblástica aguda", priority: "Media" },
                { name: "Trombocitopenia inmune primaria (PTI)", priority: "Baja" }
            ],
            "🫁 Neumología Pediátrica": [
                { name: "Asma pediátrica", priority: "Alta" },
                { name: "Bronquiolitis", priority: "Alta" },
                { name: "Neumonía pediátrica", priority: "Alta" },
                { name: "Laringotraqueítis (Crup)", priority: "Alta" },
                { name: "Aspiración de cuerpo extraño", priority: "Media" },
                { name: "Epiglotitis", priority: "Baja" },
                { name: "Fibrosis quística", priority: "Baja" }
            ]
        },
        "🤱 Ginecología y Obstetricia": {
            "🤱 Obstetricia": [
                { name: "Control prenatal", priority: "Alta" },
                { name: "Trabajo de parto normal", priority: "Alta" },
                { name: "Preeclampsia", priority: "Alta" },
                { name: "Eclampsia", priority: "Alta" },
                { name: "Diabetes gestacional", priority: "Alta" },
                { name: "Hemorragia obstétrica", priority: "Alta" },
                { name: "Aborto", priority: "Media" },
                { name: "Embarazo ectópico", priority: "Media" },
                { name: "Distocias", priority: "Media" },
                { name: "Parto pretérmino", priority: "Media" },
                { name: "Ruptura prematura de membranas", priority: "Media" },
                { name: "Enfermedad trofoblástica gestacional", priority: "Media" },
                { name: "Restricción del crecimiento intrauterino (RCIU)", priority: "Media" },
                { name: "Placenta previa", priority: "Media" },
                { name: "Desprendimiento prematuro de placenta", priority: "Media" },
                { name: "Isoinmunización materno-fetal (Rh)", priority: "Baja" },
                { name: "Violencia de género en el embarazo", priority: "Baja" }
            ],
            "👩 Ginecología": [
                { name: "Trastornos menstruales", priority: "Alta" },
                { name: "Síndrome de ovarios poliquísticos", priority: "Alta" },
                { name: "Infecciones vulvovaginales e ITS", priority: "Alta" },
                { name: "Cáncer cervicouterino", priority: "Alta" },
                { name: "Cáncer de mama", priority: "Alta" },
                { name: "Enfermedad pélvica inflamatoria", priority: "Media" },
                { name: "Endometriosis", priority: "Media" },
                { name: "Miomatosis uterina", priority: "Media" },
                { name: "Cáncer de ovario", priority: "Media" },
                { name: "Cáncer de endometrio", priority: "Media" },
                { name: "Torsión ovárica", priority: "Media" },
                { name: "Abordaje de la pareja infértil", priority: "Media" },
                { name: "Menopausia", priority: "Baja" }
            ],
            "👨‍👩‍👧‍👦 Planificación Familiar": [
                { name: "Anticoncepción hormonal", priority: "Media" },
                { name: "Interrupción legal del embarazo", priority: "Media" },
                { name: "Dispositivo intrauterino", priority: "Media" },
                { name: "Anticoncepción de emergencia", priority: "Media" },
                { name: "Métodos de barrera y espermicidas", priority: "Baja" },
                { name: "Métodos basados en el conocimiento de la fertilidad", priority: "Baja" },
                { name: "Esterilización quirúrgica", priority: "Baja" }
            ],
            "🤰 Medicina Materno-Fetal": [
                { name: "Ultrasonido obstétrico", priority: "Media" },
                { name: "Diagnóstico prenatal", priority: "Media" },
                { name: "Cardiopatía y embarazo", priority: "Media" },
                { name: "Enfermedad tiroidea y embarazo", priority: "Media" },
                { name: "Lupus eritematoso sistémico y embarazo", priority: "Baja" },
                { name: "Colestasis intrahepática del embarazo", priority: "Baja" },
                { name: "Trombofilia y embarazo", priority: "Baja" },
                { name: "Malformaciones congénitas", priority: "Baja" }
            ]
        },
        "🔪 Cirugía General": {
            "🚨 Abdomen Agudo": [
                { name: "Apendicitis aguda", priority: "Alta" },
                { name: "Obstrucción intestinal", priority: "Alta" },
                { name: "Perforación intestinal", priority: "Media" },
                { name: "Isquemia mesentérica aguda", priority: "Media" },
                { name: "Peritonitis", priority: "Baja" },
                { name: "Vólvulo intestinal", priority: "Baja" }
            ],
            "🚑 Trauma": [
                { name: "Trauma abdominal", priority: "Alta" },
                { name: "Trauma torácico", priority: "Alta" },
                { name: "Trauma craneoencefálico", priority: "Alta" },
                { name: "Politraumatizado", priority: "Media" },
                { name: "Quemaduras", priority: "Media" },
                { name: "Trauma vascular", priority: "Baja" }
            ],
            "🕳️ Hernias": [
                { name: "Hernia inguinal", priority: "Media" },
                { name: "Hernia umbilical", priority: "Media" },
                { name: "Hernia del hiato esofágico", priority: "Media" },
                { name: "Hernia incisional", priority: "Baja" },
                { name: "Hernia femoral", priority: "Baja" }
            ],
            "🟡 Patología Biliar": [
                { name: "Colelitiasis", priority: "Alta" },
                { name: "Colecistitis aguda", priority: "Alta" },
                { name: "Coledocolitiasis", priority: "Media" },
                { name: "Colangitis", priority: "Media" },
                { name: "Colangiocarcinoma (tumor de Klatskin)", priority: "Baja" }
            ],
            "🔴 Patología Colorrectal": [
                { name: "Cáncer colorrectal", priority: "Alta" },
                { name: "Hemorroides", priority: "Media" },
                { name: "Fisura anal", priority: "Media" },
                { name: "Absceso perianal", priority: "Media" },
                { name: "Fístula anal", priority: "Media" }
            ],
            "🫘 Urología": [
                { name: "Infección de vías urinarias", priority: "Alta" },
                { name: "Pielonefritis", priority: "Alta" },
                { name: "Litiasis renal", priority: "Alta" },
                { name: "Cáncer de próstata", priority: "Alta" },
                { name: "Hiperplasia prostática benigna", priority: "Media" },
                { name: "Retención urinaria aguda", priority: "Media" },
                { name: "Hematuria", priority: "Media" },
                { name: "Torsión testicular", priority: "Media" },
                { name: "Epididimitis", priority: "Baja" },
                { name: "Cáncer renal", priority: "Baja" },
                { name: "Cáncer testicular", priority: "Baja" },
                { name: "Cáncer de vejiga", priority: "Baja" }
            ],
            "🩸 Cirugía Vascular": [
                { name: "Enfermedad arterial periférica", priority: "Alta" },
                { name: "Insuficiencia arterial aguda", priority: "Alta" },
                { name: "Trombosis venosa profunda", priority: "Alta" },
                { name: "Enfermedad carotidea", priority: "Media" },
                { name: "Insuficiencia venosa crónica", priority: "Baja" },
                { name: "Aneurisma aórtico", priority: "Baja" }
            ]
        },
        "🏛️ Salud Pública": {
            "📊 Epidemiología": [
                { name: "Medidas de frecuencia", priority: "Alta" },
                { name: "Medidas de asociación", priority: "Alta" },
                { name: "Estudios epidemiológicos", priority: "Media" },
                { name: "Vigilancia epidemiológica", priority: "Media" },
                { name: "Brotes epidémicos", priority: "Media" }
            ],
            "💉 Vacunación": [
                { name: "Esquema nacional de vacunación", priority: "Alta" },
                { name: "Vacunación en adultos y adulto mayor", priority: "Media" },
                { name: "Vacunación en situaciones especiales", priority: "Media" },
                { name: "Contraindicaciones de vacunas", priority: "Media" },
                { name: "Eventos adversos post-vacunación", priority: "Baja" }
            ],
            "🛡️ Medicina Preventiva": [
                { name: "Tamizaje de cáncer", priority: "Alta" },
                { name: "Normas Oficiales Mexicanas (NOM) relevantes", priority: "Alta" },
                { name: "Prevención primaria", priority: "Media" },
                { name: "Prevención secundaria", priority: "Media" },
                { name: "Promoción de la salud", priority: "Media" },
                { name: "Factores de riesgo cardiovascular", priority: "Media" }
            ],
            "📈 Bioestadística": [
                { name: "Sensibilidad y especificidad", priority: "Alta" },
                { name: "Valores predictivos", priority: "Alta" },
                { name: "Intervalos de confianza", priority: "Media" },
                { name: "Pruebas de hipótesis", priority: "Media" },
                { name: "Distribución normal", priority: "Baja" },
                { name: "Curvas ROC", priority: "Baja" }
            ]
        },
        "🚨 Urgencias": {
            "💓 Reanimación": [
                { name: "Reanimación cardiopulmonar básica", priority: "Alta" },
                { name: "Reanimación cardiopulmonar avanzada", priority: "Alta" },
                { name: "Manejo de vía aérea", priority: "Alta" },
                { name: "Desfibrilación", priority: "Media" },
                { name: "Hemorragias masivas", priority: "Media" },
                { name: "Cardioversión", priority: "Baja" }
            ],
            "⚡ Choque": [
                { name: "Choque hipovolémico", priority: "Alta" },
                { name: "Choque cardiogénico", priority: "Alta" },
                { name: "Choque séptico", priority: "Alta" },
                { name: "Choque anafiláctico", priority: "Media" },
                { name: "Choque neurogénico", priority: "Baja" }
            ],
            "⚗️ Urgencias Metabólicas": [
                { name: "Hipoglucemia severa", priority: "Alta" },
                { name: "Estado hiperosmolar", priority: "Media" },
                { name: "Hiperkalemia severa", priority: "Media" },
                { name: "Hiponatremia severa sintomática", priority: "Baja" },
                { name: "Crisis tirotóxica", priority: "Baja" },
                { name: "Coma mixedematoso", priority: "Baja" },
                { name: "Crisis addisoniana", priority: "Baja" }
            ]
        },
        "☠️ Toxicología": {
            "🦂 Envenenamientos por Animales": [
                { name: "Picadura de alacrán", priority: "Alta" },
                { name: "Mordedura de araña viuda negra", priority: "Media" },
                { name: "Mordedura de araña violinista", priority: "Media" },
                { name: "Mordedura de serpiente", priority: "Media" }
            ],
            "💊 Intoxicaciones Medicamentosas": [
                { name: "Intoxicación por paracetamol", priority: "Alta" },
                { name: "Intoxicación por opioides", priority: "Alta" },
                { name: "Intoxicación por salicilatos", priority: "Media" },
                { name: "Intoxicación por benzodiacepinas", priority: "Media" },
                { name: "Intoxicación por antidepresivos tricíclicos", priority: "Baja" }
            ],
            "🧪 Intoxicaciones Químicas": [
                { name: "Intoxicación por monóxido de carbono", priority: "Alta" },
                { name: "Intoxicación por organofosforados", priority: "Media" },
                { name: "Intoxicación por metanol", priority: "Media" },
                { name: "Intoxicación por plomo", priority: "Media" },
                { name: "Intoxicación por etilenglicol", priority: "Baja" },
                { name: "Intoxicación por cianuro", priority: "Baja" }
            ],
            "🚬 Intoxicaciones por Drogas": [
                { name: "Intoxicación etílica aguda", priority: "Alta" },
                { name: "Síndrome de abstinencia alcohólica", priority: "Media" },
                { name: "Intoxicación por anfetaminas/metanfetaminas", priority: "Baja" },
                { name: "Síndrome de abstinencia a benzodiacepinas", priority: "Baja" },
                { name: "Intoxicación por cocaína", priority: "Baja" }
            ]
        },
        "🏥 Otras Especialidades": {
            "🧴 Dermatología": [
                { name: "Celulitis", priority: "Alta" },
                { name: "Acné vulgar", priority: "Alta" },
                { name: "Herpes zoster", priority: "Media" },
                { name: "Pénfigo vulgar y penfigoide ampolloso", priority: "Media" },
                { name: "Impétigo", priority: "Media" },
                { name: "Dermatitis atópica", priority: "Media" },
                { name: "Dermatitis por contacto", priority: "Media" },
                { name: "Tiña", priority: "Media" },
                { name: "Escabiosis", priority: "Media" },
                { name: "Carcinoma basocelular", priority: "Media" },
                { name: "Carcinoma espinocelular", priority: "Media" },
                { name: "Melanoma", priority: "Media" },
                { name: "Urticaria", priority: "Baja" },
                { name: "Dermatitis seborreica", priority: "Baja" },
                { name: "Farmacodermias", priority: "Baja" },
                { name: "VPH cutáneo (verrugas)", priority: "Baja" },
                { name: "Molusco contagioso", priority: "Baja" },
                { name: "Psoriasis", priority: "Baja" }
            ],
            "👁️ Oftalmología": [
                { name: "Glaucoma agudo", priority: "Alta" },
                { name: "Retinopatía diabética", priority: "Alta" },
                { name: "Glaucoma crónico de ángulo abierto", priority: "Media" },
                { name: "Conjuntivitis", priority: "Media" },
                { name: "Cuerpo extraño corneal", priority: "Media" },
                { name: "Desprendimiento de retina", priority: "Baja" },
                { name: "Uveítis", priority: "Baja" },
                { name: "Catarata", priority: "Baja" }
            ],
            "👂 Otorrinolaringología": [
                { name: "Otitis media aguda", priority: "Alta" },
                { name: "Faringitis", priority: "Media" },
                { name: "Sinusitis", priority: "Media" },
                { name: "Epistaxis", priority: "Media" },
                { name: "Absceso periamigdalino", priority: "Media" },
                { name: "Vértigo postural paroxístico benigno (VPPB)", priority: "Media" },
                { name: "Vértigo", priority: "Baja" },
                { name: "Hipoacusia", priority: "Baja" },
                { name: "Rinitis alérgica", priority: "Baja" }
            ],
            "🧠 Neurología": [
                { name: "Enfermedad vascular cerebral", priority: "Alta" },
                { name: "Meningitis", priority: "Alta" },
                { name: "Epilepsia", priority: "Media" },
                { name: "Cefalea", priority: "Media" },
                { name: "Síndrome de Guillain-Barré", priority: "Media" },
                { name: "Miastenia gravis", priority: "Media" },
                { name: "Enfermedad de Parkinson", priority: "Baja" },
                { name: "Esclerosis múltiple", priority: "Baja" },
                { name: "Tumores del sistema nervioso central", priority: "Baja" },
                { name: "Esclerosis lateral amiotrófica (ELA)", priority: "Baja" },
                { name: "Corea de Huntington", priority: "Baja" },
                { name: "Neurofibromatosis", priority: "Baja" }
            ],
            "🧠 Psiquiatría": [
                { name: "Depresión mayor", priority: "Alta" },
                { name: "Ideación suicida", priority: "Alta" },
                { name: "Trastorno de ansiedad", priority: "Alta" },
                { name: "Trastorno bipolar", priority: "Media" },
                { name: "Adicciones", priority: "Media" },
                { name: "Trastornos de la conducta alimentaria (anorexia y bulimia)", priority: "Media" },
                { name: "Esquizofrenia", priority: "Baja" },
                { name: "Trastorno de pánico", priority: "Baja" },
                { name: "Trastorno obsesivo-compulsivo", priority: "Baja" }
            ],
            "🦴 Ortopedia": [
                { name: "Artritis séptica", priority: "Alta" },
                { name: "Lumbalgia", priority: "Alta" },
                { name: "Fracturas", priority: "Media" },
                { name: "Luxaciones", priority: "Media" },
                { name: "Síndrome del túnel del carpo", priority: "Media" },
                { name: "Lesiones de meniscos y ligamentos de rodilla", priority: "Media" },
                { name: "Esguinces", priority: "Media" },
                { name: "Sarcomas (osteosarcoma, Ewing)", priority: "Baja" },
                { name: "Osteomielitis", priority: "Baja" }
            ],
            "💉 Anestesiología": [
                { name: "Valoración preanestésica (escalas ASA y Mallampati)", priority: "Alta" },
                { name: "Manejo del dolor", priority: "Media" },
                { name: "Anestesia general y balanceada", priority: "Media" },
                { name: "Hipertermia maligna", priority: "Baja" },
                { name: "Sedación", priority: "Baja" },
                { name: "Anestesia regional", priority: "Baja" }
            ],
            "👴 Geriatría": [
                { name: "Demencia", priority: "Media" },
                { name: "Delirium", priority: "Media" },
                { name: "Caídas en el adulto mayor", priority: "Media" },
                { name: "Incontinencia urinaria", priority: "Media" },
                { name: "Úlceras por presión", priority: "Baja" },
                { name: "Polifarmacia", priority: "Baja" },
                { name: "Depresión en el adulto mayor", priority: "Baja" }
            ],
            "🧬 Generalidades de Oncología": [
                { name: "Principios de estadificación (TNM)", priority: "Media" },
                { name: "Síndromes paraneoplásicos", priority: "Media" },
                { name: "Urgencias oncológicas", priority: "Media" },
                { name: "Principios de quimioterapia y radioterapia", priority: "Baja" }
            ]
        },
        "📚 Metodología y Técnicas de Estudio": {
            "✏️ Técnicas de Contestar Exámenes": [
                { name: "Lectura estratégica de preguntas", priority: "Alta" },
                { name: "Identificación de palabras clave", priority: "Alta" },
                { name: "Eliminación de distractores", priority: "Alta" },
                { name: "Manejo del tiempo en examen", priority: "Alta" },
                { name: "Análisis de casos clínicos largos", priority: "Media" },
                { name: "Técnicas de adivinanza educada", priority: "Media" }
            ],
            "📖 Técnicas de Estudio ENARM": [
                { name: "Método de casos clínicos", priority: "Alta" },
                { name: "Memorización de GPC/NOM", priority: "Media" },
                { name: "Repaso espaciado", priority: "Media" },
                { name: "Mapas mentales médicos", priority: "Media" },
                { name: "Simulacros estratégicos", priority: "Media" }
            ],
            "🧘 Manejo de Estrés": [
                { name: "Respiración controlada", priority: "Media" },
                { name: "Manejo de ansiedad pre-examen", priority: "Media" },
                { name: "Mindfulness médico", priority: "Baja" },
                { name: "Técnicas de recuperación", priority: "Baja" },
                { name: "Preparación mental", priority: "Baja" }
            ],
            "📊 Medicina Basada en Evidencia": [
                { name: "Interpretación de estudios", priority: "Media" },
                { name: "Niveles de evidencia", priority: "Media" },
                { name: "Lectura crítica de artículos", priority: "Baja" }
            ],
            "⚖️ Bioética y Medicina Legal": [
                { name: "Consentimiento informado", priority: "Media" },
                { name: "Principios bioéticos", priority: "Media" },
                { name: "Responsabilidad médica", priority: "Baja" }
            ],
            "💊 Farmacología Clínica": [
                { name: "Interacciones medicamentosas", priority: "Media" },
                { name: "Prescripción en poblaciones especiales", priority: "Baja" }
            ]
        }
    };
    const especialidadesLista = [
        "Anatomía Patológica", "Anestesiología", "Audiología, Otoneurología y Foniatría", "Calidad de la Atención Clínica",
        "Cirugía General", "Dermatología", "Epidemiología", "Genética Médica", "Geriatría",
        "Ginecología y Obstetricia", "Imagenología, Diagnóstica y Terapéutica", "Medicina de la Actividad Física y Deportiva",
        "Medicina de Rehabilitación", "Medicina de Urgencias", "Medicina del Trabajo y Ambiental", "Medicina Familiar",
        "Medicina Interna", "Medicina Nuclear e Imagenología Molecular", "Medicina Paliativa", "Medicina Preventiva",
        "Neumología", "Oftalmología", "Otorrinolaringología y Cirugía de Cabeza y Cuello", "Patología Clínica",
        "Pediatría", "Psiquiatría", "Radio Oncología", "Traumatología y Ortopedia"
    ];
    const scoreData = {
        "Anatomía Patológica": 57.68, "Anestesiología": 58.39, "Audiología, Otoneurología y Foniatría": 59.46,
        "Calidad de la Atención Clínica": 51.07, "Cirugía General": 63.21, "Epidemiología": 46.25, "Genética Médica": 61.61,
        "Geriatría": 57.14, "Ginecología y Obstetricia": 60.36, "Imagenología, Diagnóstica y Terapéutica": 58.04,
        "Medicina de la Actividad Física y Deportiva": 68.21, "Medicina de Rehabilitación": 58.75, "Medicina de Urgencias": 47.68,
        "Medicina del Trabajo y Ambiental": 55.71, "Medicina Familiar": 45.18, "Medicina Interna": 59.46,
        "Medicina Nuclear e Imagenología Molecular": 59.64, "Medicina Paliativa": 67.50, "Medicina Preventiva": 58.21,
        "Neumología": 60.18, "Oftalmología": 68.93, "Otorrinolaringología y Cirugía de Cabeza y Cuello": 70.00,
        "Patología Clínica": 55.36, "Pediatría": 58.57, "Psiquiatría": 62.14, "Radio Oncología": 57.86,
        "Traumatología y Ortopedia": 62.14
    };
    const materialTypes = {
        "Aprendizaje a Fondo": ["Manuales / Libros Digitales", "Videoclases Extensas", "Guías de Práctica Clínica (GPC)"],
        "Repaso y Consolidación": ["Videoclases de Repaso Rápido", "Mapas Mentales", "Flashcards", "Audio-resúmenes"],
        "Práctica y Autoevaluación": ["Bancos de Preguntas (Qbanks)", "Simulacros Parciales", "Simulacros Completos", "Casos Clínicos Interactivos"]
    };

    // --- LÓGICA DE LA INTERFAZ ---
    function renderPlatformCards() {
        platformTagsContainer.innerHTML = '';
        platforms.forEach((platform, index) => {
            const card = document.createElement('div');
            card.className = 'platform-card';
            let checkboxesHtml = '';
            for (const category in materialTypes) {
                checkboxesHtml += `<div class="material-category"><h5>${category}</h5><div class="material-checkbox-group checkbox-group">`;
                materialTypes[category].forEach(material => {
                    const isChecked = platform.materials.includes(material);
                    checkboxesHtml += `<label><input type="checkbox" data-platform-index="${index}" value="${material}" ${isChecked ? 'checked' : ''}> ${material}</label>`;
                });
                checkboxesHtml += `</div></div>`;
            }
            card.innerHTML = `
                <div class="platform-card-header">
                    <h4>${platform.name}</h4>
                    <button type="button" class="remove-platform-btn" data-index="${index}">×</button>
                </div>
                ${checkboxesHtml}
            `;
            platformTagsContainer.appendChild(card);
        });
    }

    addPlatformBtn.addEventListener('click', () => {
        const platformName = platformInput.value.trim();
        if (platformName && !platforms.some(p => p.name === platformName)) {
            platforms.push({ name: platformName, materials: [] });
            platformInput.value = '';
            renderPlatformCards();
        }
    });

    platformTagsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-platform-btn')) {
            platforms.splice(e.target.dataset.index, 1);
            renderPlatformCards();
        }
    });
    platformTagsContainer.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const platformIndex = e.target.dataset.platformIndex;
            const material = e.target.value;
            const platform = platforms[platformIndex];
            if (e.target.checked) {
                if (!platform.materials.includes(material)) platform.materials.push(material);
            } else {
                platform.materials = platform.materials.filter(m => m !== material);
            }
        }
    });
    
    function populateSpecialties() {
        especialidadesLista.sort().forEach(esp => {
            const option = document.createElement('option');
            option.value = esp;
            option.textContent = esp;
            specialtySelect.appendChild(option);
        });
    }
    
    specialtySelect.addEventListener('change', function() {
        const selectedSpecialty = this.value;
        const targetScoreInput = document.getElementById('target_score');
        
        if (selectedSpecialty && scoreData[selectedSpecialty]) {
            targetScoreInput.value = scoreData[selectedSpecialty].toFixed(2);
        } else {
            targetScoreInput.value = '';
        }
        checkHoursSuggestion();
    });

    expRadio.forEach(radio => {
        radio.addEventListener('change', function() {
            expDetails.style.display = this.value === 'Sí' ? 'block' : 'none';
        });
    });

    let simDayCounter = 0;
    const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    addSimDayBtn.addEventListener('click', function() {
        const dayEntry = document.createElement('div');
        dayEntry.className = 'simulation-day-entry';
        dayEntry.innerHTML = `
            <div class="form-section">
                <label for="sim_day_${simDayCounter}">Día de la semana</label>
                <select id="sim_day_${simDayCounter}" name="simulation_days[]" required>
                    <option value="">Selecciona un día</option>
                    ${daysOfWeek.map(day => `<option value="${day.toLowerCase()}">${day}</option>`).join('')}
                </select>
            </div>
            <div class="form-section">
                <label for="sim_hours_${simDayCounter}">Horas</label>
                <input type="number" id="sim_hours_${simDayCounter}" name="simulation_hours[]" min="1" max="12" placeholder="Ej: 4" required>
            </div>
            <button type="button" class="remove-sim-day-btn">×</button>
        `;
        simDaysContainer.appendChild(dayEntry);
        simDayCounter++;
    });
    
    simDaysContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-sim-day-btn')) {
            e.target.parentElement.remove();
        }
    });

    function renderTemario() {
        temarioContainer.innerHTML = '';
        for (const [area, subcategorias] of Object.entries(temario)) {
            const details = document.createElement('details');
            const summary = document.createElement('summary');
            summary.textContent = area;
            details.appendChild(summary);

            const topicList = document.createElement('div');
            topicList.className = 'topic-list';

            for (const [subcategoria, temas] of Object.entries(subcategorias)) {
                // Contenedor para cada subcategoría (título + temas)
                const subcategoriaWrapper = document.createElement('div');
                subcategoriaWrapper.className = 'subcategoria-wrapper';

                const subcategoriaHeader = document.createElement('div');
                subcategoriaHeader.className = 'subcategoria-header';
                subcategoriaHeader.innerHTML = `
                    <h5>${subcategoria}</h5>
                    <div class="batch-actions">
                        <button type="button" class="batch-action-btn reforzar" data-action="reforzar">Reforzar Sección</button>
                        <button type="button" class="batch-action-btn dominado" data-action="dominado">Dominar Sección</button>
                    </div>
                `;
                subcategoriaWrapper.appendChild(subcategoriaHeader);

                temas.forEach((temaObj, index) => {
                    const tema = temaObj.name;
                    const topicRow = document.createElement('div');
                    topicRow.className = 'topic-row';
                    const uniqueName = `${area}_${subcategoria}_${tema}_${index}`.replace(/[^a-zA-Z0-9_]/g, '');
                    const uniqueIdBase = uniqueName;

                    topicRow.innerHTML = `
                        <div class="topic-name" title="${tema}">${tema}</div>
                        <div class="level-selector">
                            <input type="radio" id="${uniqueIdBase}_reforzar" name="${uniqueName}" value="reforzar">
                            <label for="${uniqueIdBase}_reforzar">Reforzar</label>
                            <input type="radio" id="${uniqueIdBase}_normal" name="${uniqueName}" value="normal" checked>
                            <label for="${uniqueIdBase}_normal">Normal</label>
                            <input type="radio" id="${uniqueIdBase}_dominado" name="${uniqueName}" value="dominado">
                            <label for="${uniqueIdBase}_dominado">Dominado</label>
                        </div>
                    `;
                    subcategoriaWrapper.appendChild(topicRow);
                });
                topicList.appendChild(subcategoriaWrapper);
            }
            details.appendChild(topicList);
            temarioContainer.appendChild(details);
        }
    }
    
    phoneInput.addEventListener('input', function() {
        const phoneNumber = this.value.replace(/\D/g, '');
        this.value = phoneNumber;
        
        if (phoneNumber.length === 10) {
            phoneValidationMessage.textContent = '✓ Número válido';
            phoneValidationMessage.className = 'validation-message success';
        } else if (phoneNumber.length > 0) {
            phoneValidationMessage.textContent = `Faltan ${10 - phoneNumber.length} dígitos`;
            phoneValidationMessage.className = 'validation-message error';
        } else {
            phoneValidationMessage.textContent = '';
        }
    });

    function checkHoursSuggestion() {
        const highDemandSpecialties = ["Dermatología", "Oftalmología", "Cirugía General", "Imagenología, Diagnóstica y Terapéutica", "Otorrinolaringología y Cirugía de Cabeza y Cuello"];
        const totalHours = (parseFloat(document.getElementById('horas_lv').value) || 0) * 5 + (parseFloat(document.getElementById('horas_sabado').value) || 0) + (parseFloat(document.getElementById('horas_domingo').value) || 0);
        const selectedSpecialty = specialtySelect.value;

        if (highDemandSpecialties.includes(selectedSpecialty) && totalHours < 20 && totalHours > 0) {
            hoursSuggestionDiv.textContent = `Sugerencia: Para una especialidad de alta demanda como ${selectedSpecialty}, se recomiendan más de 20 horas semanales.`;
            hoursSuggestionDiv.style.display = 'block';
        } else {
            hoursSuggestionDiv.style.display = 'none';
        }
    }

    ['horas_lv', 'horas_sabado', 'horas_domingo'].forEach(id => document.getElementById(id).addEventListener('input', checkHoursSuggestion));

    function showAlert(message) {
        alertMessage.textContent = message;
        alertModal.style.display = 'flex';
    }

    closeModalBtn.addEventListener('click', () => {
        alertModal.style.display = 'none';
    });
    temarioContainer.addEventListener('click', function(e) {
        // Revisa si el clic fue en un botón de acción en lote
        if (e.target.classList.contains('batch-action-btn')) {
            const button = e.target;
            const action = button.dataset.action; // Obtiene la acción: 'reforzar' o 'dominado'

            // Encuentra el contenedor de la subcategoría más cercano
            const wrapper = button.closest('.subcategoria-wrapper');

            if (wrapper) {
                // Selecciona TODOS los radio buttons correspondientes a la acción dentro de esa sección
                const radiosToSelect = wrapper.querySelectorAll(`input[type="radio"][value="${action}"]`);

                // Marca cada uno de ellos como seleccionado
                radiosToSelect.forEach(radio => {
                    radio.checked = true;
                });
            }
        }
    });
    // --- LÓGICA DE ENVÍO DEL FORMULARIO (VERSIÓN CORREGIDA) ---
    generateReportBtn.addEventListener('click', function(e) {
        e.preventDefault();

        // 1. VALIDACIÓN
        if (!form.checkValidity()) {
            showAlert('Por favor, completa todos los campos obligatorios.');
            form.reportValidity();
            return;
        }
        if (phoneInput.value.length !== 10) {
            showAlert('El número de teléfono debe tener 10 dígitos.');
            return;
        }

        // 2. FEEDBACK Y RECOLECCIÓN
        generateReportBtn.disabled = true;
        generateReportBtn.textContent = 'Procesando tu perfil, por favor espera...';
        const formData = getFormDataObject();

        // 3. ENVÍO DE DATOS
        fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
        })
        .then(res => res.json()) // <-- AJUSTE CLAVE: Espera la respuesta completa del servidor.
        .then(data => {
            // 4. ÉXITO
            console.log("Respuesta del servidor:", data);
            // Oculta el formulario y muestra el mensaje de éxito
            formWrapper.style.display = 'none';
            document.getElementById('success-wrapper').style.display = 'block';
        })
        .catch(error => {
            // 5. ERROR
            console.error('Error al enviar el formulario:', error);
            showAlert('Hubo un error al enviar tu información. Por favor, inténtalo de nuevo o contacta a soporte.');
            generateReportBtn.disabled = false;
            generateReportBtn.textContent = 'Crear mi Itinerario Estratégico';
        });
    });

    function getFormDataObject() {
        const data = {};

        // --- Recolecta datos de los campos del formulario ---
        data.Timestamp = new Date().toISOString();
        data.NombreCompleto = form.nombre.value;
        data.Email = form.email.value;
        data.Telefono = form.telefono.value;
        data.EspecialidadObjetivo = form.target_specialty.value;
        data.PuntajeObjetivo = form.target_score.value;
        data.FechaENARM = form.start_date.value;
        data.HorasLV = form.horas_lv.value;
        data.HorasSabado = form.horas_sabado.value;
        data.HorasDomingo = form.horas_domingo.value;
        data.HorasSemanalesTotal = (parseFloat(data.HorasLV) * 5) + parseFloat(data.HorasSabado) + parseFloat(data.HorasDomingo);
        data.PresentoAntes = form.previous_experience.value;
        data.PuntajeAnterior = form.previous_score.value || 'N/A';
        data.AreaFuerteAnterior = form.best_specialty.value || 'N/A';
        data.AreaDebilAnterior = form.worst_specialty.value || 'N/A';
        data.ComoNosConocio = form.how_found_us.value;
        data.ComentariosAdicionales = form.detalles_dificultad.value || '';
        
        // (Pendiente añadir la recolección para EstilosAprendizajePreferidos cuando agreguemos la pregunta al HTML)
        data.EstilosAprendizajePreferidos = 'Pendiente en formulario';

        // --- Recolecta datos complejos y los convierte a texto (JSON) ---
        data.PlataformasActuales = JSON.stringify(platforms);

        const simDays = [];
        document.querySelectorAll('.simulation-day-entry').forEach(entry => {
            const day = entry.querySelector('select').value;
            const hours = entry.querySelector('input[type="number"]').value;
            if (day && hours) {
                simDays.push({ dia: day, horas: hours });
            }
        });
        data.DiasSimulacro = JSON.stringify(simDays);

        const diagnostico = {};
        document.querySelectorAll('.topic-row').forEach(row => {
            const topicName = row.querySelector('.topic-name').title;
            const selectedLevel = row.querySelector('input[type="radio"]:checked').value;
            diagnostico[topicName] = selectedLevel;
        });
        data.DiagnosticoTemas = JSON.stringify(diagnostico);

        return data;
    }
    // --- INICIALIZACIÓN ---
    populateSpecialties();
    renderTemario();
});
