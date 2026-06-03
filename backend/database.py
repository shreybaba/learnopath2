import sqlite3
import json
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "globalcourse.db")

COURSES_SEED_DATA = [
    # --- Artificial Intelligence & Machine Learning ---
    {
        "title": "CS50's Introduction to Artificial Intelligence with Python",
        "description": "Learn the foundational concepts and algorithms of modern artificial intelligence, including search algorithms, game-playing AI, knowledge representation, Bayesian networks, machine learning, and neural networks using Python libraries.",
        "university": "Harvard University",
        "instructor": "Brian Yu",
        "skills_taught": ["Python", "Search Algorithms", "Machine Learning", "Neural Networks", "Natural Language Processing", "Adversarial Search"],
        "duration_weeks": 7,
        "weekly_hours": 6,
        "difficulty": "Intermediate",
        "rating": 4.8,
        "cost": 0,
        "certificate": True,
        "category": "AI & Data Science",
        "url": "https://pll.harvard.edu/course/cs50s-introduction-artificial-intelligence-python"
    },
    {
        "title": "Machine Learning Specialization",
        "description": "Master foundational machine learning concepts and build practical skills. Learn supervised learning (linear regression, logistic regression, neural networks), unsupervised learning (clustering, anomaly detection, recommender systems), and practical ML practices.",
        "university": "Stanford University & DeepLearning.AI",
        "instructor": "Andrew Ng",
        "skills_taught": ["Supervised Learning", "Linear Regression", "Neural Networks", "Recommender Systems", "Unsupervised Learning", "Python"],
        "duration_weeks": 10,
        "weekly_hours": 8,
        "difficulty": "Beginner",
        "rating": 4.9,
        "cost": 49,
        "certificate": True,
        "category": "AI & Data Science",
        "url": "https://www.coursera.org/specializations/machine-learning-introduction"
    },
    {
        "title": "Deep Learning Specialization",
        "description": "Become a machine learning expert. Master deep learning theory, construct neural networks, learn optimization methods (Adam, Batch Norm), build Convolutional Neural Networks (CNNs) for vision, and Recurrent Neural Networks (RNNs/LSTMs) for sequential data.",
        "university": "DeepLearning.AI",
        "instructor": "Andrew Ng",
        "skills_taught": ["Deep Learning", "TensorFlow", "Neural Networks", "Hyperparameter Tuning", "Computer Vision", "Sequence Models"],
        "duration_weeks": 16,
        "weekly_hours": 9,
        "difficulty": "Advanced",
        "rating": 4.9,
        "cost": 49,
        "certificate": True,
        "category": "AI & Data Science",
        "url": "https://www.coursera.org/specializations/deep-learning"
    },
    {
        "title": "Generative AI for Everyone",
        "description": "Learn what Generative AI is, how it works, and how to apply it to your everyday work and life. Explore real-world use cases, understand LLMs, write effective prompts, and discover AI security and ethic principles.",
        "university": "DeepLearning.AI",
        "instructor": "Andrew Ng",
        "skills_taught": ["Generative AI", "Large Language Models", "Prompt Engineering", "AI Ethics", "Productivity Tools"],
        "duration_weeks": 3,
        "weekly_hours": 2,
        "difficulty": "Beginner",
        "rating": 4.8,
        "cost": 0,
        "certificate": True,
        "category": "AI & Data Science",
        "url": "https://www.coursera.org/learn/generative-ai-for-everyone"
    },
    {
        "title": "Natural Language Processing Specialization",
        "description": "Build cutting-edge NLP applications. Learn to use logistic regression, naive bayes, word vectors, vector spaces, recurrent neural networks, LSTMs, GRUs, and Transformers (BERT, T5) to perform sentiment analysis, translation, and text summarization.",
        "university": "Stanford Online",
        "instructor": "Dan Jurafsky & Chris Manning",
        "skills_taught": ["Natural Language Processing", "Transformers", "Word Embeddings", "Sentiment Analysis", "Attention Mechanisms", "PyTorch"],
        "duration_weeks": 12,
        "weekly_hours": 8,
        "difficulty": "Advanced",
        "rating": 4.7,
        "cost": 79,
        "certificate": True,
        "category": "AI & Data Science",
        "url": "https://online.stanford.edu/courses/nlp"
    },
    {
        "title": "Introduction to Computational Thinking and Data Science",
        "description": "Learn computational thinking, modeling, optimization, statistical analysis, and plotting (using matplotlib) to solve data-rich challenges. Build simulations and apply randomized algorithms.",
        "university": "MIT",
        "instructor": "John Guttag & Eric Grimson",
        "skills_taught": ["Python", "Data Analysis", "Monte Carlo Simulations", "Dynamic Programming", "Statistical Plotting"],
        "duration_weeks": 9,
        "weekly_hours": 12,
        "difficulty": "Intermediate",
        "rating": 4.7,
        "cost": 0,
        "certificate": False,
        "category": "AI & Data Science",
        "url": "https://ocw.mit.edu/courses/6-0002-introduction-to-computational-thinking-and-data-science-fall-2016/"
    },
    {
        "title": "Machine Learning Engineering for Production (MLOps)",
        "description": "Learn how to build production-grade ML pipelines. Design ML systems, manage datasets, curate training data, automate pipelines, track data provenance, and deploy models reliably with continuous monitoring.",
        "university": "DeepLearning.AI & Google Cloud",
        "instructor": "Robert Crowe",
        "skills_taught": ["MLOps", "Model Deployment", "Data Pipelines", "TensorFlow Extended", "Kubeflow", "Continuous Integration"],
        "duration_weeks": 12,
        "weekly_hours": 7,
        "difficulty": "Expert",
        "rating": 4.7,
        "cost": 49,
        "certificate": True,
        "category": "AI & Data Science",
        "url": "https://www.coursera.org/specializations/machine-learning-engineering-for-production-mlops"
    },
    {
        "title": "Mathematics for Machine Learning",
        "description": "Rebuild your mathematical intuition. Learn linear algebra, multivariate calculus, principal component analysis (PCA), and orthogonal projection to implement standard ML methods properly.",
        "university": "Imperial College London",
        "instructor": "Marc Peter Deisenroth",
        "skills_taught": ["Linear Algebra", "Calculus", "PCA", "Vector Geometry", "Eigenvalues", "Probability"],
        "duration_weeks": 8,
        "weekly_hours": 5,
        "difficulty": "Beginner",
        "rating": 4.6,
        "cost": 39,
        "certificate": True,
        "category": "AI & Data Science",
        "url": "https://www.coursera.org/specializations/mathematics-machine-learning"
    },
    {
        "title": "MicroMasters Program in Statistics and Data Science",
        "description": "A rigorous, comprehensive program in statistical methods, probability models, machine learning, and data analysis. Rigorous mathematical foundations for pursuing a serious career as a Lead Data Scientist.",
        "university": "MIT",
        "instructor": "Dimitris Bertsimas",
        "skills_taught": ["Probability", "Mathematical Statistics", "Machine Learning Algorithms", "Data Science", "Python Projects"],
        "duration_weeks": 24,
        "weekly_hours": 14,
        "difficulty": "Expert",
        "rating": 4.9,
        "cost": 1350,
        "certificate": True,
        "category": "AI & Data Science",
        "url": "https://www.edx.org/micromasters/mitx-statistics-and-data-science"
    },
    {
        "title": "Deep Learning for Computer Vision",
        "description": "Understand modern deep learning methods applied to computer vision tasks: object detection, semantic segmentation, image generation (GANs), and image classification.",
        "university": "IIT Madras",
        "instructor": "Dr. Anurag Mittal",
        "skills_taught": ["Computer Vision", "Convolutional Neural Networks", "Object Detection", "PyTorch", "Image Segmentation"],
        "duration_weeks": 12,
        "weekly_hours": 4,
        "difficulty": "Advanced",
        "rating": 4.5,
        "cost": 0,
        "certificate": True,
        "category": "AI & Data Science",
        "url": "https://onlinecourses.nptel.ac.in/"
    },

    # --- Software Engineering & Computer Science ---
    {
        "title": "CS50: Introduction to Computer Science",
        "description": "The world's most famous introduction to the intellectual enterprises of computer science and the art of programming. Covers C, Python, SQL, HTML/CSS, JavaScript, algorithms, data structures, and memory management.",
        "university": "Harvard University",
        "instructor": "David J. Malan",
        "skills_taught": ["C", "Python", "SQL", "HTML/CSS", "JavaScript", "Algorithms", "Data Structures", "Memory Management"],
        "duration_weeks": 11,
        "weekly_hours": 10,
        "difficulty": "Beginner",
        "rating": 4.9,
        "cost": 0,
        "certificate": True,
        "category": "Software Engineering",
        "url": "https://pll.harvard.edu/course/cs50-introduction-computer-science"
    },
    {
        "title": "Introduction to Computer Science and Programming Using Python",
        "description": "An introduction to computer science as a tool to solve real-world problems. Learn basic Python programming, recursion, object-oriented programming (OOP), algorithm complexity (Big O notation), and simple search/sorting algorithms.",
        "university": "MIT",
        "instructor": "Eric Grimson",
        "skills_taught": ["Python", "Object-Oriented Programming", "Algorithm Complexity", "Binary Search", "Debugging"],
        "duration_weeks": 9,
        "weekly_hours": 14,
        "difficulty": "Beginner",
        "rating": 4.8,
        "cost": 0,
        "certificate": True,
        "category": "Software Engineering",
        "url": "https://www.edx.org/course/introduction-to-computer-science-and-programming-7"
    },
    {
        "title": "Algorithms, Part I & II",
        "description": "Learn the essential algorithms and data structures that every professional programmer should know, including sorting, searching, graph algorithms, minimum spanning trees, and substring search.",
        "university": "Princeton University",
        "instructor": "Robert Sedgewick & Kevin Wayne",
        "skills_taught": ["Algorithms", "Data Structures", "Java", "Sorting", "Graph Theory", "Union-Find"],
        "duration_weeks": 12,
        "weekly_hours": 8,
        "difficulty": "Intermediate",
        "rating": 4.9,
        "cost": 0,
        "certificate": False,
        "category": "Software Engineering",
        "url": "https://www.coursera.org/learn/algorithms-part1"
    },
    {
        "title": "Full Stack Web Developer Nanodegree",
        "description": "Learn how to build database-backed web APIs and host them in the cloud. Master PostgreSQL, SQL databases, API development with Flask, identity access management (OAuth2/Auth0), and containerization using Docker.",
        "university": "Udacity",
        "instructor": "Udacity Core Team",
        "skills_taught": ["PostgreSQL", "Flask", "Docker", "RESTful APIs", "Authentication", "Deployment"],
        "duration_weeks": 16,
        "weekly_hours": 10,
        "difficulty": "Intermediate",
        "rating": 4.6,
        "cost": 399,
        "certificate": True,
        "category": "Software Engineering",
        "url": "https://www.udacity.com/course/full-stack-web-developer-nanodegree--nd0044"
    },
    {
        "title": "Modern React with Redux",
        "description": "Master React and Redux with modern Hooks and state-management patterns. Build complex responsive components, custom hooks, and dynamic portfolios with smooth animations.",
        "university": "Udemy",
        "instructor": "Stephen Grider",
        "skills_taught": ["React", "Redux", "React Hooks", "State Management", "API Integration", "CSS Grid"],
        "duration_weeks": 8,
        "weekly_hours": 6,
        "difficulty": "Intermediate",
        "rating": 4.7,
        "cost": 15,
        "certificate": True,
        "category": "Software Engineering",
        "url": "https://www.udemy.com/course/react-redux/"
    },
    {
        "title": "Next.js Professional Developer Guide",
        "description": "Learn Next.js 14+ including App Router, Server Components, Server Actions, Client Components, Server-Side Rendering (SSR), Static Site Generation (SSG), and deployment on Vercel.",
        "university": "Vercel Partner Course",
        "instructor": "Mosh Hamedani",
        "skills_taught": ["Next.js", "React Server Components", "SSR", "SEO", "Vercel", "API Routes"],
        "duration_weeks": 6,
        "weekly_hours": 5,
        "difficulty": "Advanced",
        "rating": 4.8,
        "cost": 29,
        "certificate": True,
        "category": "Software Engineering",
        "url": "https://codewithmosh.com"
    },
    {
        "title": "Distributed Systems Engineering",
        "description": "A graduate-level course covering engineering distributed systems, map-reduce, fault tolerance, replication, consistency models, Raft consensus, and distributed transactions.",
        "university": "MIT OpenCourseWare",
        "instructor": "Robert Morris",
        "skills_taught": ["Distributed Systems", "Raft Consensus", "Go", "Fault Tolerance", "Concurrency", "MapReduce"],
        "duration_weeks": 14,
        "weekly_hours": 12,
        "difficulty": "Expert",
        "rating": 4.9,
        "cost": 0,
        "certificate": False,
        "category": "Software Engineering",
        "url": "https://6824.github.io/gfs.html"
    },
    {
        "title": "Advanced Software Engineering and Systems Architecture",
        "description": "Learn to design highly-scalable, maintainable software architectures. Explore microservices, message queues (Kafka, RabbitMQ), system load balancing, horizontal scaling, and architectural patterns.",
        "university": "University of Cambridge",
        "instructor": "Dr. Alastair R. Beresford",
        "skills_taught": ["System Design", "Microservices", "Kafka", "Caching", "Load Balancing", "Architecture Patterns"],
        "duration_weeks": 10,
        "weekly_hours": 6,
        "difficulty": "Expert",
        "rating": 4.8,
        "cost": 249,
        "certificate": True,
        "category": "Software Engineering",
        "url": "https://www.ice.cam.ac.uk/courses"
    },
    {
        "title": "Data Structures and Algorithms",
        "description": "Comprehensive course covering standard data structures (hash tables, trees, heaps, graphs) and search algorithms (sorting, divide and conquer, dynamic programming) with hands-on assignments.",
        "university": "IIT Delhi (NPTEL)",
        "instructor": "Prof. Naveen Garg",
        "skills_taught": ["Data Structures", "Dynamic Programming", "Heap Sort", "Graph Traversals", "Complexity Analysis"],
        "duration_weeks": 12,
        "weekly_hours": 5,
        "difficulty": "Intermediate",
        "rating": 4.6,
        "cost": 0,
        "certificate": True,
        "category": "Software Engineering",
        "url": "https://onlinecourses.nptel.ac.in/"
    },
    {
        "title": "Web Application Architectures",
        "description": "Learn fundamental designs and technologies used in the creation of modern web applications. Study server-side frameworks, MVC architecture, front-end rendering engines, and high-performance databases.",
        "university": "Stanford Online",
        "instructor": "John Ousterhout",
        "skills_taught": ["MVC Architecture", "Databases", "Web Security", "Server-Side Scripting", "Load Testing"],
        "duration_weeks": 10,
        "weekly_hours": 7,
        "difficulty": "Intermediate",
        "rating": 4.7,
        "cost": 0,
        "certificate": False,
        "category": "Software Engineering",
        "url": "https://online.stanford.edu"
    },

    # --- Cloud Computing & Cybersecurity ---
    {
        "title": "Architecting with Google Cloud Platform Specialization",
        "description": "Design, develop, and manage robust, secure, highly available, and dynamic solutions on GCP. Learn Google Cloud Console, Compute Engine, Kubernetes Engine, and Serverless deployment.",
        "university": "Google Cloud",
        "instructor": "Google Cloud Training Team",
        "skills_taught": ["Google Cloud Platform", "Kubernetes", "Cloud Security", "Virtual Private Cloud", "IAM", "Load Balancing"],
        "duration_weeks": 8,
        "weekly_hours": 6,
        "difficulty": "Intermediate",
        "rating": 4.7,
        "cost": 49,
        "certificate": True,
        "category": "Cloud & Cybersecurity",
        "url": "https://www.coursera.org/specializations/gcp-architecture"
    },
    {
        "title": "AWS Certified Solutions Architect Associate Prep",
        "description": "Master AWS Cloud infrastructure. Learn AWS EC2, S3, RDS, Lambda, VPC, IAM, DynamoDB, Route 53, and how to build high-availability architectures that are cost-effective and secure.",
        "university": "Amazon Web Services Training",
        "instructor": "Stephane Maarek",
        "skills_taught": ["AWS Services", "Cloud Security", "VPC Networking", "Serverless Computing", "High Availability", "Database Scaling"],
        "duration_weeks": 8,
        "weekly_hours": 8,
        "difficulty": "Intermediate",
        "rating": 4.8,
        "cost": 20,
        "certificate": True,
        "category": "Cloud & Cybersecurity",
        "url": "https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/"
    },
    {
        "title": "Cybersecurity Specialization",
        "description": "Learn the essentials of systems, software, networks, and hardware security. Master penetration testing, threat analysis, cryptology basics, and security audit procedures.",
        "university": "University of Maryland, College Park",
        "instructor": "Jonathan Katz",
        "skills_taught": ["Cybersecurity", "Cryptography", "Penetration Testing", "Network Security", "Application Security", "Buffer Overflow"],
        "duration_weeks": 12,
        "weekly_hours": 6,
        "difficulty": "Intermediate",
        "rating": 4.7,
        "cost": 49,
        "certificate": True,
        "category": "Cloud & Cybersecurity",
        "url": "https://www.coursera.org/specializations/cybersecurity"
    },
    {
        "title": "Introduction to Cybersecurity",
        "description": "An introduction to the cybersecurity domain. Learn the common threats, malware, safety practices, firewall configurations, and basic network defense tactics.",
        "university": "Cisco Networking Academy",
        "instructor": "Cisco Security Team",
        "skills_taught": ["Firewall Settings", "Malware Defense", "Information Security", "Network Protocols", "Social Engineering"],
        "duration_weeks": 4,
        "weekly_hours": 4,
        "difficulty": "Beginner",
        "rating": 4.6,
        "cost": 0,
        "certificate": True,
        "category": "Cloud & Cybersecurity",
        "url": "https://www.netacad.com/courses/cybersecurity"
    },
    {
        "title": "Ethical Hacking and Penetration Testing",
        "description": "Learn how to hack systems like an ethical hacker. Master Nmap, Metasploit, SQL Injection, cross-site scripting (XSS), social engineering, and drafting professional security audits.",
        "university": "EC-Council Official Prep",
        "instructor": "Security Expert Group",
        "skills_taught": ["Ethical Hacking", "Penetration Testing", "Nmap", "Metasploit", "SQL Injection", "Vulnerability Assessment"],
        "duration_weeks": 10,
        "weekly_hours": 7,
        "difficulty": "Advanced",
        "rating": 4.8,
        "cost": 299,
        "certificate": True,
        "category": "Cloud & Cybersecurity",
        "url": "https://www.eccouncil.org"
    },
    {
        "title": "Advanced Cryptography and Secure Protocols",
        "description": "Rigorous treatment of cryptographic protocols, zero-knowledge proofs, secure multi-party computation, elliptic curve cryptography, and modern SSL/TLS mechanisms.",
        "university": "University of Oxford Online",
        "instructor": "Prof. David Duce",
        "skills_taught": ["Cryptography", "Zero-Knowledge Proofs", "SSL/TLS", "Elliptic Curve Cryptography", "Security Architecture"],
        "duration_weeks": 8,
        "weekly_hours": 9,
        "difficulty": "Expert",
        "rating": 4.9,
        "cost": 399,
        "certificate": True,
        "category": "Cloud & Cybersecurity",
        "url": "https://www.ox.ac.uk/admissions/graduate/courses"
    },

    # --- Product Management & UI/UX Design ---
    {
        "title": "Google UX Design Professional Certificate",
        "description": "Start your career in user experience (UX) design. Learn Figma, Adobe XD, design thinking, wireframing, high-fidelity prototypes, user research, and building a responsive web portfolio.",
        "university": "Google Career Certificates",
        "instructor": "Google UX Lead Designers",
        "skills_taught": ["Figma", "UX Design", "Wireframing", "User Research", "Prototyping", "Design Thinking"],
        "duration_weeks": 18,
        "weekly_hours": 8,
        "difficulty": "Beginner",
        "rating": 4.8,
        "cost": 39,
        "certificate": True,
        "category": "Product & Design",
        "url": "https://www.coursera.org/professional-certificates/google-ux-design"
    },
    {
        "title": "AI Product Management Specialization",
        "description": "Learn to manage and scale AI/ML products. Define product goals, validate data requirements, design key metrics, manage machine learning lifecycles, and handle AI ethics.",
        "university": "Duke University",
        "instructor": "Jon Reifschneider",
        "skills_taught": ["Product Management", "AI Lifecycle", "User Research", "Agile Roadmap", "Data Labeling", "ML Ethics"],
        "duration_weeks": 6,
        "weekly_hours": 6,
        "difficulty": "Intermediate",
        "rating": 4.7,
        "cost": 49,
        "certificate": True,
        "category": "Product & Design",
        "url": "https://www.coursera.org/specializations/ai-product-management-duke"
    },
    {
        "title": "UX/UI Design Specialization",
        "description": "A visual-first approach to UI/UX. Master typography, grid systems, interface aesthetics, responsive UI structures, custom branding, and interactive desktop mockups.",
        "university": "CalArts (California Institute of the Arts)",
        "instructor": "Michael Worthington",
        "skills_taught": ["UI Design", "Interface Typography", "Grid Systems", "Figma", "Adobe Illustrator", "Color Schemes"],
        "duration_weeks": 10,
        "weekly_hours": 5,
        "difficulty": "Beginner",
        "rating": 4.6,
        "cost": 49,
        "certificate": True,
        "category": "Product & Design",
        "url": "https://www.coursera.org/specializations/user-interface-design"
    },
    {
        "title": "Oxford FinTech Programme",
        "description": "Understand the changing landscape of financial technologies. Explore block chain foundations, crowdfunding models, AI robo-advising, mobile wallets, and financial platform regulations.",
        "university": "University of Oxford",
        "instructor": "Peter Tufano",
        "skills_taught": ["FinTech", "Blockchain", "Platform Business Models", "Regulation Tech", "AI in Finance"],
        "duration_weeks": 6,
        "weekly_hours": 8,
        "difficulty": "Intermediate",
        "rating": 4.8,
        "cost": 1850,
        "certificate": True,
        "category": "Product & Design",
        "url": "https://www.sbs.ox.ac.uk/programmes/oxford-fintech-programme"
    },
    {
        "title": "Cambridge Venture Creation Programme",
        "description": "Learn how to build startup ventures around bleeding-edge technologies. Pitching strategies, market validation, capitalization tables, intellectual property laws, and product roadmap development.",
        "university": "University of Cambridge",
        "instructor": "Dr. Shailendra Vyakarnam",
        "skills_taught": ["Tech Entrepreneurship", "Intellectual Property", "Market Validation", "Pitching", "Cap Tables"],
        "duration_weeks": 4,
        "weekly_hours": 10,
        "difficulty": "Advanced",
        "rating": 4.9,
        "cost": 950,
        "certificate": True,
        "category": "Product & Design",
        "url": "https://www.jbs.cam.ac.uk"
    },
    {
        "title": "Human-Computer Interaction (HCI) Seminar",
        "description": "Advanced research topics in HCI. Learn about natural user interfaces, tangible computing, empirical study evaluation methodologies, design ethics, and user experience psychology.",
        "university": "Stanford University Online",
        "instructor": "Scott Klemmer",
        "skills_taught": ["Interaction Design", "User Testing", "Empirical Evaluation", "UX Psychology", "Prototyping Tools"],
        "duration_weeks": 8,
        "weekly_hours": 6,
        "difficulty": "Advanced",
        "rating": 4.8,
        "cost": 0,
        "certificate": False,
        "category": "Product & Design",
        "url": "https://online.stanford.edu"
    },
    # --- Medicine & Healthcare ---
    {
        "title": "Introduction to Clinical Informatics and Digital Health",
        "description": "Learn the fundamentals of clinical data, health information systems, electronic health records (EHR), and the application of technology to clinical practice and patient care.",
        "university": "Stanford University",
        "instructor": "Dr. Robert Harrington",
        "skills_taught": ["Clinical Informatics", "Health Information Systems", "EHR Systems", "Digital Health", "Biostatistics"],
        "duration_weeks": 6,
        "weekly_hours": 4,
        "difficulty": "Beginner",
        "rating": 4.8,
        "cost": 0,
        "certificate": True,
        "category": "Medicine & Healthcare",
        "url": "https://online.stanford.edu"
    },
    {
        "title": "AI in Healthcare: Algorithms and Applications",
        "description": "Understand how artificial intelligence and machine learning are revolutionizing clinical workflows, diagnostic imaging, precision medicine, and therapeutic developments.",
        "university": "Harvard Medical School",
        "instructor": "Dr. Isaac Kohane",
        "skills_taught": ["AI in Healthcare", "Clinical Machine Learning", "Diagnostic Imaging", "Precision Medicine", "Healthcare AI Ethics"],
        "duration_weeks": 8,
        "weekly_hours": 6,
        "difficulty": "Intermediate",
        "rating": 4.9,
        "cost": 120,
        "certificate": True,
        "category": "Medicine & Healthcare",
        "url": "https://pll.harvard.edu"
    },
    {
        "title": "Epidemiology in Public Health Practice",
        "description": "Study the distribution and determinants of health-related states in populations. Learn surveillance, research design, outbreak investigation, and epidemic modeling.",
        "university": "Johns Hopkins University",
        "instructor": "Dr. Moyses Szklo",
        "skills_taught": ["Epidemiology", "Public Health", "Outbreak Investigation", "Biostatistics", "Data Collection"],
        "duration_weeks": 10,
        "weekly_hours": 5,
        "difficulty": "Intermediate",
        "rating": 4.7,
        "cost": 49,
        "certificate": True,
        "category": "Medicine & Healthcare",
        "url": "https://www.coursera.org"
    },
    {
        "title": "Bioinformatics: Genomes, Algorithms, and Evolution",
        "description": "Discover algorithms for sequence alignment, genome assembly, phylogenetic analysis, and molecular modeling. Master BLAST, sequence databases, and computational biology pipelines.",
        "university": "UC San Diego",
        "instructor": "Dr. Pavel Pevzner",
        "skills_taught": ["Bioinformatics", "Genomics", "Sequence Alignment", "Computational Biology", "Python Bioinformatics"],
        "duration_weeks": 12,
        "weekly_hours": 8,
        "difficulty": "Advanced",
        "rating": 4.8,
        "cost": 79,
        "certificate": True,
        "category": "Medicine & Healthcare",
        "url": "https://www.edx.org"
    },
    {
        "title": "Healthcare Administration and System Policy",
        "description": "Examine health system operations, quality management, regulatory compliance, policy design, and financial structures of modern healthcare organizations.",
        "university": "Yale School of Public Health",
        "instructor": "Dr. Elizabeth Bradley",
        "skills_taught": ["Healthcare Administration", "Health Policy", "Quality Management", "Regulatory Compliance", "Healthcare Finance"],
        "duration_weeks": 8,
        "weekly_hours": 4,
        "difficulty": "Intermediate",
        "rating": 4.6,
        "cost": 0,
        "certificate": False,
        "category": "Medicine & Healthcare",
        "url": "https://www.coursera.org"
    },
    # --- Law & Legal Studies ---
    {
        "title": "Introduction to Constitutional Law: Civil Liberties & Rights",
        "description": "Analyze landmark judicial decisions, constitutional interpretation methodologies, separation of powers, federalism, and the protection of fundamental civil liberties.",
        "university": "Yale Law School",
        "instructor": "Prof. Akhil Reed Amar",
        "skills_taught": ["Constitutional Law", "Civil Liberties", "Judicial Precedent", "Legal Reasoning", "Constitutional Rights"],
        "duration_weeks": 8,
        "weekly_hours": 5,
        "difficulty": "Beginner",
        "rating": 4.9,
        "cost": 0,
        "certificate": True,
        "category": "Law & Legal Studies",
        "url": "https://www.coursera.org"
    },
    {
        "title": "Intellectual Property Law and Policy in the Digital Age",
        "description": "Explore copyright, patent, trademark, and trade secret laws. Learn how digital disruption, software patents, open source, and AI are reshaping intellectual property protections.",
        "university": "University of Pennsylvania",
        "instructor": "Prof. R. Polk Wagner",
        "skills_taught": ["Intellectual Property", "Patent Law", "Copyright Law", "Trademark Protections", "Legal Tech"],
        "duration_weeks": 6,
        "weekly_hours": 6,
        "difficulty": "Intermediate",
        "rating": 4.7,
        "cost": 49,
        "certificate": True,
        "category": "Law & Legal Studies",
        "url": "https://www.edx.org"
    },
    {
        "title": "Corporate Compliance, Governance, and Risk Management",
        "description": "Master corporate governance standards, compliance program design, financial regulations, ethical guidelines, and risk mitigation strategies in multinational corporations.",
        "university": "Columbia Law School",
        "instructor": "Prof. John C. Coffee Jr.",
        "skills_taught": ["Corporate Compliance", "Governance Standards", "Risk Management", "Financial Regulations", "Business Ethics"],
        "duration_weeks": 10,
        "weekly_hours": 4,
        "difficulty": "Advanced",
        "rating": 4.8,
        "cost": 99,
        "certificate": True,
        "category": "Law & Legal Studies",
        "url": "https://www.coursera.org"
    },
    {
        "title": "Legal Technology and the Future of Legal Services",
        "description": "Discover how AI-driven contract analysis, smart legal contracts, blockchain, automated document review, and e-discovery are transforming legal practice and law firms.",
        "university": "Northwestern University",
        "instructor": "Prof. Daniel W. Linna Jr.",
        "skills_taught": ["Legal Tech", "Smart Contracts", "Contract Analysis", "Automated Document Review", "E-Discovery"],
        "duration_weeks": 6,
        "weekly_hours": 5,
        "difficulty": "Intermediate",
        "rating": 4.6,
        "cost": 0,
        "certificate": True,
        "category": "Law & Legal Studies",
        "url": "https://www.coursera.org"
    },
    {
        "title": "International Law and Global Policy Frameworks",
        "description": "Study treaty interpretation, international organizations, sovereignty, state responsibility, human rights laws, and the resolution of transnational disputes.",
        "university": "Oxford Law Faculty",
        "instructor": "Prof. Dapo Akande",
        "skills_taught": ["International Law", "Global Policy", "Treaty Interpretation", "Human Rights", "Dispute Resolution"],
        "duration_weeks": 10,
        "weekly_hours": 6,
        "difficulty": "Advanced",
        "rating": 4.9,
        "cost": 199,
        "certificate": True,
        "category": "Law & Legal Studies",
        "url": "https://www.edx.org"
    },
    # --- Psychology & Behavioral Sciences ---
    {
        "title": "Introduction to Psychology: Mind, Brain, and Behavior",
        "description": "Explore the scientific study of human thought and behavior. Covers cognition, memory, perception, development, mental health, social behavior, and neuroscience foundations.",
        "university": "Yale University",
        "instructor": "Prof. Paul Bloom",
        "skills_taught": ["General Psychology", "Cognition", "Behavioral Analysis", "Developmental Psychology", "Neuroscience Foundations"],
        "duration_weeks": 6,
        "weekly_hours": 5,
        "difficulty": "Beginner",
        "rating": 4.9,
        "cost": 0,
        "certificate": True,
        "category": "Psychology & Behavioral Sciences",
        "url": "https://www.coursera.org"
    },
    {
        "title": "Cognitive Psychology: How the Mind Works",
        "description": "Study mental processes including attention, memory, problem-solving, language acquisition, decision-making, and mental representations.",
        "university": "MIT",
        "instructor": "Prof. John Gabrieli",
        "skills_taught": ["Cognitive Psychology", "Attention & Memory", "Problem-Solving", "Decision-Making", "Cognitive Neuroscience"],
        "duration_weeks": 8,
        "weekly_hours": 6,
        "difficulty": "Intermediate",
        "rating": 4.8,
        "cost": 0,
        "certificate": False,
        "category": "Psychology & Behavioral Sciences",
        "url": "https://online.mit.edu"
    },
    {
        "title": "Clinical Psychology: Counseling & Psychotherapy",
        "description": "Understand psychiatric diagnoses (DSM-5), clinical assessment protocols, and evidence-based psychotherapies like Cognitive Behavioral Therapy (CBT) and psychoanalysis.",
        "university": "University of Toronto",
        "instructor": "Dr. Steve Joordens",
        "skills_taught": ["Clinical Psychology", "Psychiatric Diagnoses", "Counseling Techniques", "Cognitive Behavioral Therapy", "Mental Health Assessment"],
        "duration_weeks": 10,
        "weekly_hours": 5,
        "difficulty": "Intermediate",
        "rating": 4.7,
        "cost": 49,
        "certificate": True,
        "category": "Psychology & Behavioral Sciences",
        "url": "https://www.coursera.org"
    },
    {
        "title": "Social Psychology: Human Interaction and Influence",
        "description": "Examine how individuals think about, influence, and relate to one another. Covers social conformity, group dynamics, prejudice, persuasion, and interpersonal relationships.",
        "university": "Wesleyan University",
        "instructor": "Prof. Scott Plous",
        "skills_taught": ["Social Psychology", "Group Dynamics", "Persuasion", "Human Interaction", "Interpersonal Relationships"],
        "duration_weeks": 7,
        "weekly_hours": 4,
        "difficulty": "Beginner",
        "rating": 4.9,
        "cost": 0,
        "certificate": True,
        "category": "Psychology & Behavioral Sciences",
        "url": "https://www.coursera.org"
    },
    {
        "title": "Behavioral Neuroscience: Brain and Behavior",
        "description": "Explore the biological basis of behavior. Study brain anatomy, neurotransmitters, sensory systems, learning circuits, and the neurobiology of sleep, emotion, and addiction.",
        "university": "Stanford University",
        "instructor": "Dr. Robert Sapolsky",
        "skills_taught": ["Behavioral Neuroscience", "Brain Anatomy", "Neurotransmitters", "Neurobiology", "Endocrine Systems"],
        "duration_weeks": 12,
        "weekly_hours": 8,
        "difficulty": "Advanced",
        "rating": 4.9,
        "cost": 149,
        "certificate": True,
        "category": "Psychology & Behavioral Sciences",
        "url": "https://online.stanford.edu"
    }
]

def init_db():
    """Initializes SQLite database and seeds with course data if empty."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        profile TEXT
    )
    """)

    # Create tracking table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tracking (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        course_id INTEGER NOT NULL,
        status TEXT NOT NULL,
        completed_weeks TEXT NOT NULL,
        hours_studied REAL NOT NULL,
        notes TEXT,
        UNIQUE(user_id, course_id),
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
    )
    """)

    # Create courses table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT UNIQUE NOT NULL,
        description TEXT NOT NULL,
        university TEXT NOT NULL,
        instructor TEXT NOT NULL,
        skills_taught TEXT NOT NULL,  -- JSON string of skills
        duration_weeks INTEGER NOT NULL,
        weekly_hours INTEGER NOT NULL,
        difficulty TEXT NOT NULL,
        rating REAL NOT NULL,
        cost REAL NOT NULL,
        certificate INTEGER NOT NULL, -- 0 or 1
        category TEXT NOT NULL,
        url TEXT
    )
    """)
    
    # Check if we need to seed
    cursor.execute("SELECT COUNT(*) FROM courses")
    count = cursor.fetchone()[0]
    
    if count == 0:
        print(f"Seeding database with {len(COURSES_SEED_DATA)} courses...")
        for c in COURSES_SEED_DATA:
            cursor.execute("""
            INSERT INTO courses (
                title, description, university, instructor, skills_taught, 
                duration_weeks, weekly_hours, difficulty, rating, cost, 
                certificate, category, url
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                c["title"],
                c["description"],
                c["university"],
                c["instructor"],
                json.dumps(c["skills_taught"]),
                c["duration_weeks"],
                c["weekly_hours"],
                c["difficulty"],
                c["rating"],
                c["cost"],
                1 if c["certificate"] else 0,
                c["category"],
                c["url"]
            ))
        conn.commit()
        print("Database seeded successfully!")
    else:
        print("Database already contains data, skipping seeding.")
        
    conn.close()

if __name__ == "__main__":
    init_db()
