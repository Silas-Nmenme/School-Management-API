// Seed data for faculties, departments and courses
// Updated to match user's exact format with uppercase names and emojis

const facultiesData = [
  { name: "🔬 FACULTY OF SCIENCE", description: "Faculty of Science", icon: "🔬" },
  { name: "🏗 FACULTY OF ENGINEERING", description: "Faculty of Engineering", icon: "🏗" },
  { name: "💼 FACULTY OF BUSINESS & MANAGEMENT SCIENCES", description: "Faculty of Business & Management Sciences", icon: "💼" },
  { name: "🎨 FACULTY OF ARTS & HUMANITIES", description: "Faculty of Arts & Humanities", icon: "🎨" },
  { name: "🌍 FACULTY OF SOCIAL SCIENCES", description: "Faculty of Social Sciences", icon: "🌍" },
  { name: "🏥 FACULTY OF HEALTH SCIENCES", description: "Faculty of Health Sciences", icon: "🏥" },
  { name: "⚖ FACULTY OF LAW", description: "Faculty of Law", icon: "⚖" },
  { name: "🌾 FACULTY OF AGRICULTURE", description: "Faculty of Agriculture", icon: "🌾" },
  { name: "🏛 FACULTY OF EDUCATION", description: "Faculty of Education", icon: "🏛" },
  { name: "🏗 FACULTY OF ENVIRONMENTAL SCIENCES", description: "Faculty of Environmental Sciences", icon: "🏗" },
  { name: "💻 FACULTY OF INFORMATION & DIGITAL TECHNOLOGIES", description: "Faculty of Information & Digital Technologies", icon: "💻" },
  { name: "🚢 FACULTY OF TRANSPORT & LOGISTICS", description: "Faculty of Transport & Logistics", icon: "🚢" },
  { name: "🎭 FACULTY OF CREATIVE & MEDIA TECHNOLOGIES", description: "Faculty of Creative & Media Technologies", icon: "🎭" },
  { name: "🔬 FACULTY OF ADVANCED RESEARCH & INNOVATION", description: "Faculty of Advanced Research & Innovation", icon: "🔬" },
  { name: "📊 FACULTY OF PROFESSIONAL STUDIES", description: "Faculty of Professional Studies", icon: "📊" }
];

const departmentsData = [
  // FACULTY OF SCIENCE
  { 
    facultyName: "🔬 FACULTY OF SCIENCE", 
    name: "Department of Computer Science",
    courses: [
      { name: "BSc Computer Science", type: "BSc" },
      { name: "MSc Computer Science", type: "MSc" },
      { name: "PhD Computer Science", type: "PhD" }
    ]
  },
  { 
    facultyName: "🔬 FACULTY OF SCIENCE", 
    name: "Department of Software Engineering",
    courses: [
      { name: "BSc Software Engineering", type: "BSc" },
      { name: "MSc Software Engineering", type: "MSc" },
      { name: "PhD Software Engineering", type: "PhD" }
    ]
  },
  { 
    facultyName: "🔬 FACULTY OF SCIENCE", 
    name: "Department of Information Systems",
    courses: [
      { name: "BSc Information Systems", type: "BSc" },
      { name: "MSc Information Systems", type: "MSc" },
      { name: "PhD Information Systems", type: "PhD" }
    ]
  },
  { 
    facultyName: "🔬 FACULTY OF SCIENCE", 
    name: "Department of Cybersecurity",
    courses: [
      { name: "BSc Cybersecurity", type: "BSc" },
      { name: "MSc Cybersecurity", type: "MSc" },
      { name: "PhD Cybersecurity", type: "PhD" }
    ]
  },
  { 
    facultyName: "🔬 FACULTY OF SCIENCE", 
    name: "Department of Artificial Intelligence",
    courses: [
      { name: "BSc Artificial Intelligence", type: "BSc" },
      { name: "MSc Artificial Intelligence", type: "MSc" },
      { name: "PhD Artificial Intelligence", type: "PhD" }
    ]
  },
  { 
    facultyName: "🔬 FACULTY OF SCIENCE", 
    name: "Department of Data Science",
    courses: [
      { name: "BSc Data Science", type: "BSc" },
      { name: "MSc Data Science", type: "MSc" },
      { name: "PhD Data Science", type: "PhD" }
    ]
  },
  { 
    facultyName: "🔬 FACULTY OF SCIENCE", 
    name: "Department of Mathematics",
    courses: [
      { name: "BSc Mathematics", type: "BSc" },
      { name: "MSc Mathematics", type: "MSc" },
      { name: "PhD Mathematics", type: "PhD" }
    ]
  },
  { 
    facultyName: "🔬 FACULTY OF SCIENCE", 
    name: "Department of Applied Mathematics",
    courses: [
      { name: "BSc Applied Mathematics", type: "BSc" },
      { name: "MSc Applied Mathematics", type: "MSc" },
      { name: "PhD Applied Mathematics", type: "PhD" }
    ]
  },
  { 
    facultyName: "🔬 FACULTY OF SCIENCE", 
    name: "Department of Statistics",
    courses: [
      { name: "BSc Statistics", type: "BSc" },
      { name: "MSc Statistics", type: "MSc" },
      { name: "PhD Statistics", type: "PhD" }
    ]
  },
  { 
    facultyName: "🔬 FACULTY OF SCIENCE", 
    name: "Department of Actuarial Science",
    courses: [
      { name: "BSc Actuarial Science", type: "BSc" },
      { name: "MSc Actuarial Science", type: "MSc" },
      { name: "PhD Actuarial Science", type: "PhD" }
    ]
  },
  { 
    facultyName: "🔬 FACULTY OF SCIENCE", 
    name: "Department of Physics",
    courses: [
      { name: "BSc Physics", type: "BSc" },
      { name: "MSc Physics", type: "MSc" },
      { name: "PhD Physics", type: "PhD" }
    ]
  },
  { 
    facultyName: "🔬 FACULTY OF SCIENCE", 
    name: "Department of Applied Physics",
    courses: [
      { name: "BSc Applied Physics", type: "BSc" },
      { name: "MSc Applied Physics", type: "MSc" },
      { name: "PhD Applied Physics", type: "PhD" }
    ]
  },
  { 
    facultyName: "🔬 FACULTY OF SCIENCE", 
    name: "Department of Medical Physics",
    courses: [
      { name: "BSc Medical Physics", type: "BSc" },
      { name: "MSc Medical Physics", type: "MSc" },
      { name: "PhD Medical Physics", type: "PhD" }
    ]
  },
  { 
    facultyName: "🔬 FACULTY OF SCIENCE", 
    name: "Department of Chemistry",
    courses: [
      { name: "BSc Chemistry", type: "BSc" },
      { name: "MSc Chemistry", type: "MSc" },
      { name: "PhD Chemistry", type: "PhD" }
    ]
  },
  { 
    facultyName: "🔬 FACULTY OF SCIENCE", 
    name: "Department of Industrial Chemistry",
    courses: [
      { name: "BSc Industrial Chemistry", type: "BSc" },
      { name: "MSc Industrial Chemistry", type: "MSc" },
      { name: "PhD Industrial Chemistry", type: "PhD" }
    ]
  },
  { 
    facultyName: "🔬 FACULTY OF SCIENCE", 
    name: "Department of Biochemistry",
    courses: [
      { name: "BSc Biochemistry", type: "BSc" },
      { name: "MSc Biochemistry", type: "MSc" },
      { name: "PhD Biochemistry", type: "PhD" }
    ]
  },
  { 
    facultyName: "🔬 FACULTY OF SCIENCE", 
    name: "Department of Biology",
    courses: [
      { name: "BSc Biology", type: "BSc" },
      { name: "MSc Biology", type: "MSc" },
      { name: "PhD Biology", type: "PhD" }
    ]
  },
  { 
    facultyName: "🔬 FACULTY OF SCIENCE", 
    name: "Department of Microbiology",
    courses: [
      { name: "BSc Microbiology", type: "BSc" },
      { name: "MSc Microbiology", type: "MSc" },
      { name: "PhD Microbiology", type: "PhD" }
    ]
  },
  { 
    facultyName: "🔬 FACULTY OF SCIENCE", 
    name: "Department of Biotechnology",
    courses: [
      { name: "BSc Biotechnology", type: "BSc" },
      { name: "MSc Biotechnology", type: "MSc" },
      { name: "PhD Biotechnology", type: "PhD" }
    ]
  },
  { 
    facultyName: "🔬 FACULTY OF SCIENCE", 
    name: "Department of Environmental Science",
    courses: [
      { name: "BSc Environmental Science", type: "BSc" },
      { name: "MSc Environmental Science", type: "MSc" },
      { name: "PhD Environmental Science", type: "PhD" }
    ]
  },

  // FACULTY OF ENGINEERING
  { 
    facultyName: "🏗 FACULTY OF ENGINEERING", 
    name: "Department of Mechanical Engineering",
    courses: [
      { name: "BEng Mechanical Engineering", type: "BEng" },
      { name: "MEng Mechanical Engineering", type: "MEng" },
      { name: "PhD Mechanical Engineering", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏗 FACULTY OF ENGINEERING", 
    name: "Department of Mechatronics Engineering",
    courses: [
      { name: "BEng Mechatronics Engineering", type: "BEng" },
      { name: "MEng Mechatronics Engineering", type: "MEng" },
      { name: "PhD Mechatronics Engineering", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏗 FACULTY OF ENGINEERING", 
    name: "Department of Automotive Engineering",
    courses: [
      { name: "BEng Automotive Engineering", type: "BEng" },
      { name: "MEng Automotive Engineering", type: "MEng" },
      { name: "PhD Automotive Engineering", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏗 FACULTY OF ENGINEERING", 
    name: "Department of Civil Engineering",
    courses: [
      { name: "BEng Civil Engineering", type: "BEng" },
      { name: "MEng Civil Engineering", type: "MEng" },
      { name: "PhD Civil Engineering", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏗 FACULTY OF ENGINEERING", 
    name: "Department of Structural Engineering",
    courses: [
      { name: "BEng Structural Engineering", type: "BEng" },
      { name: "MEng Structural Engineering", type: "MEng" },
      { name: "PhD Structural Engineering", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏗 FACULTY OF ENGINEERING", 
    name: "Department of Building Engineering",
    courses: [
      { name: "BEng Building Engineering", type: "BEng" },
      { name: "MEng Building Engineering", type: "MEng" },
      { name: "PhD Building Engineering", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏗 FACULTY OF ENGINEERING", 
    name: "Department of Electrical Engineering",
    courses: [
      { name: "BEng Electrical Engineering", type: "BEng" },
      { name: "MEng Electrical Engineering", type: "MEng" },
      { name: "PhD Electrical Engineering", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏗 FACULTY OF ENGINEERING", 
    name: "Department of Electronics Engineering",
    courses: [
      { name: "BEng Electronics Engineering", type: "BEng" },
      { name: "MEng Electronics Engineering", type: "MEng" },
      { name: "PhD Electronics Engineering", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏗 FACULTY OF ENGINEERING", 
    name: "Department of Computer Engineering",
    courses: [
      { name: "BEng Computer Engineering", type: "BEng" },
      { name: "MEng Computer Engineering", type: "MEng" },
      { name: "PhD Computer Engineering", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏗 FACULTY OF ENGINEERING", 
    name: "Department of Telecommunications Engineering",
    courses: [
      { name: "BEng Telecommunications Engineering", type: "BEng" },
      { name: "MEng Telecommunications Engineering", type: "MEng" },
      { name: "PhD Telecommunications Engineering", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏗 FACULTY OF ENGINEERING", 
    name: "Department of Chemical Engineering",
    courses: [
      { name: "BEng Chemical Engineering", type: "BEng" },
      { name: "MEng Chemical Engineering", type: "MEng" },
      { name: "PhD Chemical Engineering", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏗 FACULTY OF ENGINEERING", 
    name: "Department of Petroleum Engineering",
    courses: [
      { name: "BEng Petroleum Engineering", type: "BEng" },
      { name: "MEng Petroleum Engineering", type: "MEng" },
      { name: "PhD Petroleum Engineering", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏗 FACULTY OF ENGINEERING", 
    name: "Department of Gas Engineering",
    courses: [
      { name: "BEng Gas Engineering", type: "BEng" },
      { name: "MEng Gas Engineering", type: "MEng" },
      { name: "PhD Gas Engineering", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏗 FACULTY OF ENGINEERING", 
    name: "Department of Marine Engineering",
    courses: [
      { name: "BEng Marine Engineering", type: "BEng" },
      { name: "MEng Marine Engineering", type: "MEng" },
      { name: "PhD Marine Engineering", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏗 FACULTY OF ENGINEERING", 
    name: "Department of Aerospace Engineering",
    courses: [
      { name: "BEng Aerospace Engineering", type: "BEng" },
      { name: "MEng Aerospace Engineering", type: "MEng" },
      { name: "PhD Aerospace Engineering", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏗 FACULTY OF ENGINEERING", 
    name: "Department of Agricultural Engineering",
    courses: [
      { name: "BEng Agricultural Engineering", type: "BEng" },
      { name: "MEng Agricultural Engineering", type: "MEng" },
      { name: "PhD Agricultural Engineering", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏗 FACULTY OF ENGINEERING", 
    name: "Department of Biomedical Engineering",
    courses: [
      { name: "BEng Biomedical Engineering", type: "BEng" },
      { name: "MEng Biomedical Engineering", type: "MEng" },
      { name: "PhD Biomedical Engineering", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏗 FACULTY OF ENGINEERING", 
    name: "Department of Materials Engineering",
    courses: [
      { name: "BEng Materials Engineering", type: "BEng" },
      { name: "MEng Materials Engineering", type: "MEng" },
      { name: "PhD Materials Engineering", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏗 FACULTY OF ENGINEERING", 
    name: "Department of Metallurgical Engineering",
    courses: [
      { name: "BEng Metallurgical Engineering", type: "BEng" },
      { name: "MEng Metallurgical Engineering", type: "MEng" },
      { name: "PhD Metallurgical Engineering", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏗 FACULTY OF ENGINEERING", 
    name: "Department of Industrial & Production Engineering",
    courses: [
      { name: "BEng Industrial & Production Engineering", type: "BEng" },
      { name: "MEng Industrial & Production Engineering", type: "MEng" },
      { name: "PhD Industrial & Production Engineering", type: "PhD" }
    ]
  },

  // FACULTY OF BUSINESS & MANAGEMENT SCIENCES
  { 
    facultyName: "💼 FACULTY OF BUSINESS & MANAGEMENT SCIENCES", 
    name: "Department of Business Administration",
    courses: [
      { name: "BBA Business Administration", type: "BBA" },
      { name: "MBA Business Administration", type: "MBA" },
      { name: "PhD Business Administration", type: "PhD" }
    ]
  },
  { 
    facultyName: "💼 FACULTY OF BUSINESS & MANAGEMENT SCIENCES", 
    name: "Department of Management Studies",
    courses: [
      { name: "BBA Management Studies", type: "BBA" },
      { name: "MBA Management Studies", type: "MBA" },
      { name: "PhD Management Studies", type: "PhD" }
    ]
  },
  { 
    facultyName: "💼 FACULTY OF BUSINESS & MANAGEMENT SCIENCES", 
    name: "Department of Human Resource Management",
    courses: [
      { name: "BBA Human Resource Management", type: "BBA" },
      { name: "MBA Human Resource Management", type: "MBA" },
      { name: "PhD Human Resource Management", type: "PhD" }
    ]
  },
  { 
    facultyName: "💼 FACULTY OF BUSINESS & MANAGEMENT SCIENCES", 
    name: "Department of Entrepreneurship",
    courses: [
      { name: "BBA Entrepreneurship", type: "BBA" },
      { name: "MBA Entrepreneurship", type: "MBA" },
      { name: "PhD Entrepreneurship", type: "PhD" }
    ]
  },
  { 
    facultyName: "💼 FACULTY OF BUSINESS & MANAGEMENT SCIENCES", 
    name: "Department of Marketing",
    courses: [
      { name: "BBA Marketing", type: "BBA" },
      { name: "MBA Marketing", type: "MBA" },
      { name: "PhD Marketing", type: "PhD" }
    ]
  },
  { 
    facultyName: "💼 FACULTY OF BUSINESS & MANAGEMENT SCIENCES", 
    name: "Department of International Business",
    courses: [
      { name: "BBA International Business", type: "BBA" },
      { name: "MBA International Business", type: "MBA" },
      { name: "PhD International Business", type: "PhD" }
    ]
  },
  { 
    facultyName: "💼 FACULTY OF BUSINESS & MANAGEMENT SCIENCES", 
    name: "Department of Accounting",
    courses: [
      { name: "BBA Accounting", type: "BBA" },
      { name: "MBA Accounting", type: "MBA" },
      { name: "PhD Accounting", type: "PhD" }
    ]
  },
  { 
    facultyName: "💼 FACULTY OF BUSINESS & MANAGEMENT SCIENCES", 
    name: "Department of Finance",
    courses: [
      { name: "BBA Finance", type: "BBA" },
      { name: "MBA Finance", type: "MBA" },
      { name: "PhD Finance", type: "PhD" }
    ]
  },
  { 
    facultyName: "💼 FACULTY OF BUSINESS & MANAGEMENT SCIENCES", 
    name: "Department of Banking & Finance",
    courses: [
      { name: "BBA Banking & Finance", type: "BBA" },
      { name: "MBA Banking & Finance", type: "MBA" },
      { name: "PhD Banking & Finance", type: "PhD" }
    ]
  },
  { 
    facultyName: "💼 FACULTY OF BUSINESS & MANAGEMENT SCIENCES", 
    name: "Department of Insurance",
    courses: [
      { name: "BBA Insurance", type: "BBA" },
      { name: "MBA Insurance", type: "MBA" },
      { name: "PhD Insurance", type: "PhD" }
    ]
  },
  { 
    facultyName: "💼 FACULTY OF BUSINESS & MANAGEMENT SCIENCES", 
    name: "Department of Economics",
    courses: [
      { name: "BBA Economics", type: "BBA" },
      { name: "MBA Economics", type: "MBA" },
      { name: "PhD Economics", type: "PhD" }
    ]
  },
  { 
    facultyName: "💼 FACULTY OF BUSINESS & MANAGEMENT SCIENCES", 
    name: "Department of Development Economics",
    courses: [
      { name: "BBA Development Economics", type: "BBA" },
      { name: "MBA Development Economics", type: "MBA" },
      { name: "PhD Development Economics", type: "PhD" }
    ]
  },
  { 
    facultyName: "💼 FACULTY OF BUSINESS & MANAGEMENT SCIENCES", 
    name: "Department of Public Administration",
    courses: [
      { name: "BBA Public Administration", type: "BBA" },
      { name: "MBA Public Administration", type: "MBA" },
      { name: "PhD Public Administration", type: "PhD" }
    ]
  },
  { 
    facultyName: "💼 FACULTY OF BUSINESS & MANAGEMENT SCIENCES", 
    name: "Department of Procurement & Supply Chain",
    courses: [
      { name: "BBA Procurement & Supply Chain", type: "BBA" },
      { name: "MBA Procurement & Supply Chain", type: "MBA" },
      { name: "PhD Procurement & Supply Chain", type: "PhD" }
    ]
  },
  { 
    facultyName: "💼 FACULTY OF BUSINESS & MANAGEMENT SCIENCES", 
    name: "Department of Logistics Management",
    courses: [
      { name: "BBA Logistics Management", type: "BBA" },
      { name: "MBA Logistics Management", type: "MBA" },
      { name: "PhD Logistics Management", type: "PhD" }
    ]
  },
  { 
    facultyName: "💼 FACULTY OF BUSINESS & MANAGEMENT SCIENCES", 
    name: "Department of Project Management",
    courses: [
      { name: "BBA Project Management", type: "BBA" },
      { name: "MBA Project Management", type: "MBA" },
      { name: "PhD Project Management", type: "PhD" }
    ]
  },
  { 
    facultyName: "💼 FACULTY OF BUSINESS & MANAGEMENT SCIENCES", 
    name: "Department of Taxation",
    courses: [
      { name: "BBA Taxation", type: "BBA" },
      { name: "MBA Taxation", type: "MBA" },
      { name: "PhD Taxation", type: "PhD" }
    ]
  },
  { 
    facultyName: "💼 FACULTY OF BUSINESS & MANAGEMENT SCIENCES", 
    name: "Department of Real Estate Management",
    courses: [
      { name: "BBA Real Estate Management", type: "BBA" },
      { name: "MBA Real Estate Management", type: "MBA" },
      { name: "PhD Real Estate Management", type: "PhD" }
    ]
  },
  { 
    facultyName: "💼 FACULTY OF BUSINESS & MANAGEMENT SCIENCES", 
    name: "Department of Hospitality Management",
    courses: [
      { name: "BBA Hospitality Management", type: "BBA" },
      { name: "MBA Hospitality Management", type: "MBA" },
      { name: "PhD Hospitality Management", type: "PhD" }
    ]
  },
  { 
    facultyName: "💼 FACULTY OF BUSINESS & MANAGEMENT SCIENCES", 
    name: "Department of Tourism Management",
    courses: [
      { name: "BBA Tourism Management", type: "BBA" },
      { name: "MBA Tourism Management", type: "MBA" },
      { name: "PhD Tourism Management", type: "PhD" }
    ]
  },

  // FACULTY OF ARTS & HUMANITIES
  { 
    facultyName: "🎨 FACULTY OF ARTS & HUMANITIES", 
    name: "Department of English Language",
    courses: [
      { name: "BA English Language", type: "BA" },
      { name: "MA English Language", type: "MA" },
      { name: "PhD English Language", type: "PhD" }
    ]
  },
  { 
    facultyName: "🎨 FACULTY OF ARTS & HUMANITIES", 
    name: "Department of English Literature",
    courses: [
      { name: "BA English Literature", type: "BA" },
      { name: "MA English Literature", type: "MA" },
      { name: "PhD English Literature", type: "PhD" }
    ]
  },
  { 
    facultyName: "🎨 FACULTY OF ARTS & HUMANITIES", 
    name: "Department of Linguistics",
    courses: [
      { name: "BA Linguistics", type: "BA" },
      { name: "MA Linguistics", type: "MA" },
      { name: "PhD Linguistics", type: "PhD" }
    ]
  },
  { 
    facultyName: "🎨 FACULTY OF ARTS & HUMANITIES", 
    name: "Department of Creative Writing",
    courses: [
      { name: "BA Creative Writing", type: "BA" },
      { name: "MA Creative Writing", type: "MA" },
      { name: "PhD Creative Writing", type: "PhD" }
    ]
  },
  { 
    facultyName: "🎨 FACULTY OF ARTS & HUMANITIES", 
    name: "Department of History",
    courses: [
      { name: "BA History", type: "BA" },
      { name: "MA History", type: "MA" },
      { name: "PhD History", type: "PhD" }
    ]
  },
  { 
    facultyName: "🎨 FACULTY OF ARTS & HUMANITIES", 
    name: "Department of International Studies",
    courses: [
      { name: "BA International Studies", type: "BA" },
      { name: "MA International Studies", type: "MA" },
      { name: "PhD International Studies", type: "PhD" }
    ]
  },
  { 
    facultyName: "🎨 FACULTY OF ARTS & HUMANITIES", 
    name: "Department of Philosophy",
    courses: [
      { name: "BA Philosophy", type: "BA" },
      { name: "MA Philosophy", type: "MA" },
      { name: "PhD Philosophy", type: "PhD" }
    ]
  },
  { 
    facultyName: "🎨 FACULTY OF ARTS & HUMANITIES", 
    name: "Department of Religious Studies",
    courses: [
      { name: "BA Religious Studies", type: "BA" },
      { name: "MA Religious Studies", type: "MA" },
      { name: "PhD Religious Studies", type: "PhD" }
    ]
  },
  { 
    facultyName: "🎨 FACULTY OF ARTS & HUMANITIES", 
    name: "Department of Islamic Studies",
    courses: [
      { name: "BA Islamic Studies", type: "BA" },
      { name: "MA Islamic Studies", type: "MA" },
      { name: "PhD Islamic Studies", type: "PhD" }
    ]
  },
  { 
    facultyName: "🎨 FACULTY OF ARTS & HUMANITIES", 
    name: "Department of Christian Studies",
    courses: [
      { name: "BA Christian Studies", type: "BA" },
      { name: "MA Christian Studies", type: "MA" },
      { name: "PhD Christian Studies", type: "PhD" }
    ]
  },
  { 
    facultyName: "🎨 FACULTY OF ARTS & HUMANITIES", 
    name: "Department of Theatre Arts",
    courses: [
      { name: "BA Theatre Arts", type: "BA" },
      { name: "MA Theatre Arts", type: "MA" },
      { name: "PhD Theatre Arts", type: "PhD" }
    ]
  },
  { 
    facultyName: "🎨 FACULTY OF ARTS & HUMANITIES", 
    name: "Department of Performing Arts",
    courses: [
      { name: "BA Performing Arts", type: "BA" },
      { name: "MA Performing Arts", type: "MA" },
      { name: "PhD Performing Arts", type: "PhD" }
    ]
  },
  { 
    facultyName: "🎨 FACULTY OF ARTS & HUMANITIES", 
    name: "Department of Music",
    courses: [
      { name: "BA Music", type: "BA" },
      { name: "MA Music", type: "MA" },
      { name: "PhD Music", type: "PhD" }
    ]
  },
  { 
    facultyName: "🎨 FACULTY OF ARTS & HUMANITIES", 
    name: "Department of Fine Arts",
    courses: [
      { name: "BA Fine Arts", type: "BA" },
      { name: "MA Fine Arts", type: "MA" },
      { name: "PhD Fine Arts", type: "PhD" }
    ]
  },
  { 
    facultyName: "🎨 FACULTY OF ARTS & HUMANITIES", 
    name: "Department of Visual Arts",
    courses: [
      { name: "BA Visual Arts", type: "BA" },
      { name: "MA Visual Arts", type: "MA" },
      { name: "PhD Visual Arts", type: "PhD" }
    ]
  },
  { 
    facultyName: "🎨 FACULTY OF ARTS & HUMANITIES", 
    name: "Department of Graphic Design",
    courses: [
      { name: "BA Graphic Design", type: "BA" },
      { name: "MA Graphic Design", type: "MA" },
      { name: "PhD Graphic Design", type: "PhD" }
    ]
  },
  { 
    facultyName: "🎨 FACULTY OF ARTS & HUMANITIES", 
    name: "Department of Fashion Design",
    courses: [
      { name: "BA Fashion Design", type: "BA" },
      { name: "MA Fashion Design", type: "MA" },
      { name: "PhD Fashion Design", type: "PhD" }
    ]
  },
  { 
    facultyName: "🎨 FACULTY OF ARTS & HUMANITIES", 
    name: "Department of French",
    courses: [
      { name: "BA French", type: "BA" },
      { name: "MA French", type: "MA" },
      { name: "PhD French", type: "PhD" }
    ]
  },
  { 
    facultyName: "🎨 FACULTY OF ARTS & HUMANITIES", 
    name: "Department of Spanish",
    courses: [
      { name: "BA Spanish", type: "BA" },
      { name: "MA Spanish", type: "MA" },
      { name: "PhD Spanish", type: "PhD" }
    ]
  },
  { 
    facultyName: "🎨 FACULTY OF ARTS & HUMANITIES", 
    name: "Department of Chinese Studies",
    courses: [
      { name: "BA Chinese Studies", type: "BA" },
      { name: "MA Chinese Studies", type: "MA" },
      { name: "PhD Chinese Studies", type: "PhD" }
    ]
  },

  // FACULTY OF SOCIAL SCIENCES
  { 
    facultyName: "🌍 FACULTY OF SOCIAL SCIENCES", 
    name: "Department of Political Science",
    courses: [
      { name: "BA Political Science", type: "BA" },
      { name: "MA Political Science", type: "MA" },
      { name: "PhD Political Science", type: "PhD" }
    ]
  },
  { 
    facultyName: "🌍 FACULTY OF SOCIAL SCIENCES", 
    name: "Department of Public Policy",
    courses: [
      { name: "BA Public Policy", type: "BA" },
      { name: "MA Public Policy", type: "MA" },
      { name: "PhD Public Policy", type: "PhD" }
    ]
  },
  { 
    facultyName: "🌍 FACULTY OF SOCIAL SCIENCES", 
    name: "Department of Sociology",
    courses: [
      { name: "BA Sociology", type: "BA" },
      { name: "MA Sociology", type: "MA" },
      { name: "PhD Sociology", type: "PhD" }
    ]
  },
  { 
    facultyName: "🌍 FACULTY OF SOCIAL SCIENCES", 
    name: "Department of Anthropology",
    courses: [
      { name: "BA Anthropology", type: "BA" },
      { name: "MA Anthropology", type: "MA" },
      { name: "PhD Anthropology", type: "PhD" }
    ]
  },
  { 
    facultyName: "🌍 FACULTY OF SOCIAL SCIENCES", 
    name: "Department of Psychology",
    courses: [
      { name: "BA Psychology", type: "BA" },
      { name: "MA Psychology", type: "MA" },
      { name: "PhD Psychology", type: "PhD" }
    ]
  },
  { 
    facultyName: "🌍 FACULTY OF SOCIAL SCIENCES", 
    name: "Department of Criminology",
    courses: [
      { name: "BA Criminology", type: "BA" },
      { name: "MA Criminology", type: "MA" },
      { name: "PhD Criminology", type: "PhD" }
    ]
  },
  { 
    facultyName: "🌍 FACULTY OF SOCIAL SCIENCES", 
    name: "Department of Peace & Conflict Studies",
    courses: [
      { name: "BA Peace & Conflict Studies", type: "BA" },
      { name: "MA Peace & Conflict Studies", type: "MA" },
      { name: "PhD Peace & Conflict Studies", type: "PhD" }
    ]
  },
  { 
    facultyName: "🌍 FACULTY OF SOCIAL SCIENCES", 
    name: "Department of Gender Studies",
    courses: [
      { name: "BA Gender Studies", type: "BA" },
      { name: "MA Gender Studies", type: "MA" },
      { name: "PhD Gender Studies", type: "PhD" }
    ]
  },
  { 
    facultyName: "🌍 FACULTY OF SOCIAL SCIENCES", 
    name: "Department of Geography",
    courses: [
      { name: "BA Geography", type: "BA" },
      { name: "MA Geography", type: "MA" },
      { name: "PhD Geography", type: "PhD" }
    ]
  },
  { 
    facultyName: "🌍 FACULTY OF SOCIAL SCIENCES", 
    name: "Department of Urban & Regional Planning",
    courses: [
      { name: "BA Urban & Regional Planning", type: "BA" },
      { name: "MA Urban & Regional Planning", type: "MA" },
      { name: "PhD Urban & Regional Planning", type: "PhD" }
    ]
  },
  { 
    facultyName: "🌍 FACULTY OF SOCIAL SCIENCES", 
    name: "Department of Demography",
    courses: [
      { name: "BA Demography", type: "BA" },
      { name: "MA Demography", type: "MA" },
      { name: "PhD Demography", type: "PhD" }
    ]
  },
  { 
    facultyName: "🌍 FACULTY OF SOCIAL SCIENCES", 
    name: "Department of Social Work",
    courses: [
      { name: "BA Social Work", type: "BA" },
      { name: "MA Social Work", type: "MA" },
      { name: "PhD Social Work", type: "PhD" }
    ]
  },
  { 
    facultyName: "🌍 FACULTY OF SOCIAL SCIENCES", 
    name: "Department of International Relations",
    courses: [
      { name: "BA International Relations", type: "BA" },
      { name: "MA International Relations", type: "MA" },
      { name: "PhD International Relations", type: "PhD" }
    ]
  },
  { 
    facultyName: "🌍 FACULTY OF SOCIAL SCIENCES", 
    name: "Department of Strategic Studies",
    courses: [
      { name: "BA Strategic Studies", type: "BA" },
      { name: "MA Strategic Studies", type: "MA" },
      { name: "PhD Strategic Studies", type: "PhD" }
    ]
  },
  { 
    facultyName: "🌍 FACULTY OF SOCIAL SCIENCES", 
    name: "Department of Security Studies",
    courses: [
      { name: "BA Security Studies", type: "BA" },
      { name: "MA Security Studies", type: "MA" },
      { name: "PhD Security Studies", type: "PhD" }
    ]
  },
  { 
    facultyName: "🌍 FACULTY OF SOCIAL SCIENCES", 
    name: "Department of Communication Studies",
    courses: [
      { name: "BA Communication Studies", type: "BA" },
      { name: "MA Communication Studies", type: "MA" },
      { name: "PhD Communication Studies", type: "PhD" }
    ]
  },
  { 
    facultyName: "🌍 FACULTY OF SOCIAL SCIENCES", 
    name: "Department of Media Studies",
    courses: [
      { name: "BA Media Studies", type: "BA" },
      { name: "MA Media Studies", type: "MA" },
      { name: "PhD Media Studies", type: "PhD" }
    ]
  },
  { 
    facultyName: "🌍 FACULTY OF SOCIAL SCIENCES", 
    name: "Department of Journalism",
    courses: [
      { name: "BA Journalism", type: "BA" },
      { name: "MA Journalism", type: "MA" },
      { name: "PhD Journalism", type: "PhD" }
    ]
  },
  { 
    facultyName: "🌍 FACULTY OF SOCIAL SCIENCES", 
    name: "Department of Broadcasting",
    courses: [
      { name: "BA Broadcasting", type: "BA" },
      { name: "MA Broadcasting", type: "MA" },
      { name: "PhD Broadcasting", type: "PhD" }
    ]
  },
  { 
    facultyName: "🌍 FACULTY OF SOCIAL SCIENCES", 
    name: "Department of Development Studies",
    courses: [
      { name: "BA Development Studies", type: "BA" },
      { name: "MA Development Studies", type: "MA" },
      { name: "PhD Development Studies", type: "PhD" }
    ]
  },

  // FACULTY OF HEALTH SCIENCES
  { 
    facultyName: "🏥 FACULTY OF HEALTH SCIENCES", 
    name: "Department of Medicine",
    courses: [
      { name: "MBBS Medicine", type: "MBBS" }
    ]
  },
  { 
    facultyName: "🏥 FACULTY OF HEALTH SCIENCES", 
    name: "Department of Surgery",
    courses: [
      { name: "MBBS Surgery", type: "MBBS" }
    ]
  },
  { 
    facultyName: "🏥 FACULTY OF HEALTH SCIENCES", 
    name: "Department of Nursing",
    courses: [
      { name: "BSc Nursing", type: "BSc" },
      { name: "MSc Nursing", type: "MSc" },
      { name: "PhD Nursing", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏥 FACULTY OF HEALTH SCIENCES", 
    name: "Department of Pharmacy",
    courses: [
      { name: "BSc Pharmacy", type: "BSc" },
      { name: "MSc Pharmacy", type: "MSc" },
      { name: "PhD Pharmacy", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏥 FACULTY OF HEALTH SCIENCES", 
    name: "Department of Pharmacology",
    courses: [
      { name: "BSc Pharmacology", type: "BSc" },
      { name: "MSc Pharmacology", type: "MSc" },
      { name: "PhD Pharmacology", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏥 FACULTY OF HEALTH SCIENCES", 
    name: "Department of Anatomy",
    courses: [
      { name: "BSc Anatomy", type: "BSc" },
      { name: "MSc Anatomy", type: "MSc" },
      { name: "PhD Anatomy", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏥 FACULTY OF HEALTH SCIENCES", 
    name: "Department of Physiology",
    courses: [
      { name: "BSc Physiology", type: "BSc" },
      { name: "MSc Physiology", type: "MSc" },
      { name: "PhD Physiology", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏥 FACULTY OF HEALTH SCIENCES", 
    name: "Department of Medical Laboratory Science",
    courses: [
      { name: "BSc Medical Laboratory Science", type: "BSc" },
      { name: "MSc Medical Laboratory Science", type: "MSc" },
      { name: "PhD Medical Laboratory Science", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏥 FACULTY OF HEALTH SCIENCES", 
    name: "Department of Public Health",
    courses: [
      { name: "BSc Public Health", type: "BSc" },
      { name: "MSc Public Health", type: "MSc" },
      { name: "PhD Public Health", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏥 FACULTY OF HEALTH SCIENCES", 
    name: "Department of Environmental Health",
    courses: [
      { name: "BSc Environmental Health", type: "BSc" },
      { name: "MSc Environmental Health", type: "MSc" },
      { name: "PhD Environmental Health", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏥 FACULTY OF HEALTH SCIENCES", 
    name: "Department of Dentistry",
    courses: [
      { name: "BSc Dentistry", type: "BSc" },
      { name: "MSc Dentistry", type: "MSc" },
      { name: "PhD Dentistry", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏥 FACULTY OF HEALTH SCIENCES", 
    name: "Department of Optometry",
    courses: [
      { name: "BSc Optometry", type: "BSc" },
      { name: "MSc Optometry", type: "MSc" },
      { name: "PhD Optometry", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏥 FACULTY OF HEALTH SCIENCES", 
    name: "Department of Physiotherapy",
    courses: [
      { name: "BSc Physiotherapy", type: "BSc" },
      { name: "MSc Physiotherapy", type: "MSc" },
      { name: "PhD Physiotherapy", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏥 FACULTY OF HEALTH SCIENCES", 
    name: "Department of Radiography",
    courses: [
      { name: "BSc Radiography", type: "BSc" },
      { name: "MSc Radiography", type: "MSc" },
      { name: "PhD Radiography", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏥 FACULTY OF HEALTH SCIENCES", 
    name: "Department of Nutrition & Dietetics",
    courses: [
      { name: "BSc Nutrition & Dietetics", type: "BSc" },
      { name: "MSc Nutrition & Dietetics", type: "MSc" },
      { name: "PhD Nutrition & Dietetics", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏥 FACULTY OF HEALTH SCIENCES", 
    name: "Department of Epidemiology",
    courses: [
      { name: "BSc Epidemiology", type: "BSc" },
      { name: "MSc Epidemiology", type: "MSc" },
      { name: "PhD Epidemiology", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏥 FACULTY OF HEALTH SCIENCES", 
    name: "Department of Health Information Management",
    courses: [
      { name: "BSc Health Information Management", type: "BSc" },
      { name: "MSc Health Information Management", type: "MSc" },
      { name: "PhD Health Information Management", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏥 FACULTY OF HEALTH SCIENCES", 
    name: "Department of Community Health",
    courses: [
      { name: "BSc Community Health", type: "BSc" },
      { name: "MSc Community Health", type: "MSc" },
      { name: "PhD Community Health", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏥 FACULTY OF HEALTH SCIENCES", 
    name: "Department of Veterinary Medicine",
    courses: [
      { name: "BSc Veterinary Medicine", type: "BSc" },
      { name: "MSc Veterinary Medicine", type: "MSc" },
      { name: "PhD Veterinary Medicine", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏥 FACULTY OF HEALTH SCIENCES", 
    name: "Department of Biomedical Sciences",
    courses: [
      { name: "BSc Biomedical Sciences", type: "BSc" },
      { name: "MSc Biomedical Sciences", type: "MSc" },
      { name: "PhD Biomedical Sciences", type: "PhD" }
    ]
  },

  // FACULTY OF LAW
  { 
    facultyName: "⚖ FACULTY OF LAW", 
    name: "Department of Public Law",
    courses: [
      { name: "LLB (Hons) Public Law", type: "LLB" },
      { name: "LLM Public Law", type: "LLM" },
      { name: "PhD Public Law", type: "PhD" }
    ]
  },
  { 
    facultyName: "⚖ FACULTY OF LAW", 
    name: "Department of Private Law",
    courses: [
      { name: "LLB (Hons) Private Law", type: "LLB" },
      { name: "LLM Private Law", type: "LLM" },
      { name: "PhD Private Law", type: "PhD" }
    ]
  },
  { 
    facultyName: "⚖ FACULTY OF LAW", 
    name: "Department of Commercial Law",
    courses: [
      { name: "LLB (Hons) Commercial Law", type: "LLB" },
      { name: "LLM Commercial Law", type: "LLM" },
      { name: "PhD Commercial Law", type: "PhD" }
    ]
  },
  { 
    facultyName: "⚖ FACULTY OF LAW", 
    name: "Department of International Law",
    courses: [
      { name: "LLB (Hons) International Law", type: "LLB" },
      { name: "LLM International Law", type: "LLM" },
      { name: "PhD International Law", type: "PhD" }
    ]
  },
  { 
    facultyName: "⚖ FACULTY OF LAW", 
    name: "Department of Constitutional Law",
    courses: [
      { name: "LLB (Hons) Constitutional Law", type: "LLB" },
      { name: "LLM Constitutional Law", type: "LLM" },
      { name: "PhD Constitutional Law", type: "PhD" }
    ]
  },
  { 
    facultyName: "⚖ FACULTY OF LAW", 
    name: "Department of Criminal Law",
    courses: [
      { name: "LLB (Hons) Criminal Law", type: "LLB" },
      { name: "LLM Criminal Law", type: "LLM" },
      { name: "PhD Criminal Law", type: "PhD" }
    ]
  },
  { 
    facultyName: "⚖ FACULTY OF LAW", 
    name: "Department of Property Law",
    courses: [
      { name: "LLB (Hons) Property Law", type: "LLB" },
      { name: "LLM Property Law", type: "LLM" },
      { name: "PhD Property Law", type: "PhD" }
    ]
  },
  { 
    facultyName: "⚖ FACULTY OF LAW", 
    name: "Department of Maritime Law",
    courses: [
      { name: "LLB (Hons) Maritime Law", type: "LLB" },
      { name: "LLM Maritime Law", type: "LLM" },
      { name: "PhD Maritime Law", type: "PhD" }
    ]
  },
  { 
    facultyName: "⚖ FACULTY OF LAW", 
    name: "Department of Environmental Law",
    courses: [
      { name: "LLB (Hons) Environmental Law", type: "LLB" },
      { name: "LLM Environmental Law", type: "LLM" },
      { name: "PhD Environmental Law", type: "PhD" }
    ]
  },
  { 
    facultyName: "⚖ FACULTY OF LAW", 
    name: "Department of Tax Law",
    courses: [
      { name: "LLB (Hons) Tax Law", type: "LLB" },
      { name: "LLM Tax Law", type: "LLM" },
      { name: "PhD Tax Law", type: "PhD" }
    ]
  },

  // FACULTY OF AGRICULTURE
  { 
    facultyName: "🌾 FACULTY OF AGRICULTURE", 
    name: "Department of Crop Science",
    courses: [
      { name: "BSc Crop Science", type: "BSc" },
      { name: "MSc Crop Science", type: "MSc" },
      { name: "PhD Crop Science", type: "PhD" }
    ]
  },
  { 
    facultyName: "🌾 FACULTY OF AGRICULTURE", 
    name: "Department of Soil Science",
    courses: [
      { name: "BSc Soil Science", type: "BSc" },
      { name: "MSc Soil Science", type: "MSc" },
      { name: "PhD Soil Science", type: "PhD" }
    ]
  },
  { 
    facultyName: "🌾 FACULTY OF AGRICULTURE", 
    name: "Department of Animal Science",
    courses: [
      { name: "BSc Animal Science", type: "BSc" },
      { name: "MSc Animal Science", type: "MSc" },
      { name: "PhD Animal Science", type: "PhD" }
    ]
  },
  { 
    facultyName: "🌾 FACULTY OF AGRICULTURE", 
    name: "Department of Agricultural Economics",
    courses: [
      { name: "BSc Agricultural Economics", type: "BSc" },
      { name: "MSc Agricultural Economics", type: "MSc" },
      { name: "PhD Agricultural Economics", type: "PhD" }
    ]
  },
  { 
    facultyName: "🌾 FACULTY OF AGRICULTURE", 
    name: "Department of Agribusiness",
    courses: [
      { name: "BSc Agribusiness", type: "BSc" },
      { name: "MSc Agribusiness", type: "MSc" },
      { name: "PhD Agribusiness", type: "PhD" }
    ]
  },
  { 
    facultyName: "🌾 FACULTY OF AGRICULTURE", 
    name: "Department of Fisheries & Aquaculture",
    courses: [
      { name: "BSc Fisheries & Aquaculture", type: "BSc" },
      { name: "MSc Fisheries & Aquaculture", type: "MSc" },
      { name: "PhD Fisheries & Aquaculture", type: "PhD" }
    ]
  },
  { 
    facultyName: "🌾 FACULTY OF AGRICULTURE", 
    name: "Department of Forestry",
    courses: [
      { name: "BSc Forestry", type: "BSc" },
      { name: "MSc Forestry", type: "MSc" },
      { name: "PhD Forestry", type: "PhD" }
    ]
  },
  { 
    facultyName: "🌾 FACULTY OF AGRICULTURE", 
    name: "Department of Horticulture",
    courses: [
      { name: "BSc Horticulture", type: "BSc" },
      { name: "MSc Horticulture", type: "MSc" },
      { name: "PhD Horticulture", type: "PhD" }
    ]
  },
  { 
    facultyName: "🌾 FACULTY OF AGRICULTURE", 
    name: "Department of Plant Breeding",
    courses: [
      { name: "BSc Plant Breeding", type: "BSc" },
      { name: "MSc Plant Breeding", type: "MSc" },
      { name: "PhD Plant Breeding", type: "PhD" }
    ]
  },
  { 
    facultyName: "🌾 FACULTY OF AGRICULTURE", 
    name: "Department of Agricultural Extension",
    courses: [
      { name: "BSc Agricultural Extension", type: "BSc" },
      { name: "MSc Agricultural Extension", type: "MSc" },
      { name: "PhD Agricultural Extension", type: "PhD" }
    ]
  },

  // FACULTY OF EDUCATION
  { 
    facultyName: "🏛 FACULTY OF EDUCATION", 
    name: "Department of Educational Management",
    courses: [
      { name: "B.Ed Educational Management", type: "B.Ed" },
      { name: "M.Ed Educational Management", type: "M.Ed" },
      { name: "PhD Educational Management", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏛 FACULTY OF EDUCATION", 
    name: "Department of Curriculum Studies",
    courses: [
      { name: "B.Ed Curriculum Studies", type: "B.Ed" },
      { name: "M.Ed Curriculum Studies", type: "M.Ed" },
      { name: "PhD Curriculum Studies", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏛 FACULTY OF EDUCATION", 
    name: "Department of Early Childhood Education",
    courses: [
      { name: "B.Ed Early Childhood Education", type: "B.Ed" },
      { name: "M.Ed Early Childhood Education", type: "M.Ed" },
      { name: "PhD Early Childhood Education", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏛 FACULTY OF EDUCATION", 
    name: "Department of Primary Education",
    courses: [
      { name: "B.Ed Primary Education", type: "B.Ed" },
      { name: "M.Ed Primary Education", type: "M.Ed" },
      { name: "PhD Primary Education", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏛 FACULTY OF EDUCATION", 
    name: "Department of Secondary Education",
    courses: [
      { name: "B.Ed Secondary Education", type: "B.Ed" },
      { name: "M.Ed Secondary Education", type: "M.Ed" },
      { name: "PhD Secondary Education", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏛 FACULTY OF EDUCATION", 
    name: "Department of Guidance & Counselling",
    courses: [
      { name: "B.Ed Guidance & Counselling", type: "B.Ed" },
      { name: "M.Ed Guidance & Counselling", type: "M.Ed" },
      { name: "PhD Guidance & Counselling", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏛 FACULTY OF EDUCATION", 
    name: "Department of Special Education",
    courses: [
      { name: "B.Ed Special Education", type: "B.Ed" },
      { name: "M.Ed Special Education", type: "M.Ed" },
      { name: "PhD Special Education", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏛 FACULTY OF EDUCATION", 
    name: "Department of Educational Psychology",
    courses: [
      { name: "B.Ed Educational Psychology", type: "B.Ed" },
      { name: "M.Ed Educational Psychology", type: "M.Ed" },
      { name: "PhD Educational Psychology", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏛 FACULTY OF EDUCATION", 
    name: "Department of Adult Education",
    courses: [
      { name: "B.Ed Adult Education", type: "B.Ed" },
      { name: "M.Ed Adult Education", type: "M.Ed" },
      { name: "PhD Adult Education", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏛 FACULTY OF EDUCATION", 
    name: "Department of Science Education",
    courses: [
      { name: "B.Ed Science Education", type: "B.Ed" },
      { name: "M.Ed Science Education", type: "M.Ed" },
      { name: "PhD Science Education", type: "PhD" }
    ]
  },

  // FACULTY OF ENVIRONMENTAL SCIENCES
  { 
    facultyName: "🏗 FACULTY OF ENVIRONMENTAL SCIENCES", 
    name: "Department of Architecture",
    courses: [
      { name: "BSc Architecture", type: "BSc" },
      { name: "MSc Architecture", type: "MSc" },
      { name: "PhD Architecture", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏗 FACULTY OF ENVIRONMENTAL SCIENCES", 
    name: "Department of Quantity Surveying",
    courses: [
      { name: "BSc Quantity Surveying", type: "BSc" },
      { name: "MSc Quantity Surveying", type: "MSc" },
      { name: "PhD Quantity Surveying", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏗 FACULTY OF ENVIRONMENTAL SCIENCES", 
    name: "Department of Building Technology",
    courses: [
      { name: "BSc Building Technology", type: "BSc" },
      { name: "MSc Building Technology", type: "MSc" },
      { name: "PhD Building Technology", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏗 FACULTY OF ENVIRONMENTAL SCIENCES", 
    name: "Department of Estate Management",
    courses: [
      { name: "BSc Estate Management", type: "BSc" },
      { name: "MSc Estate Management", type: "MSc" },
      { name: "PhD Estate Management", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏗 FACULTY OF ENVIRONMENTAL SCIENCES", 
    name: "Department of Surveying & Geoinformatics",
    courses: [
      { name: "BSc Surveying & Geoinformatics", type: "BSc" },
      { name: "MSc Surveying & Geoinformatics", type: "MSc" },
      { name: "PhD Surveying & Geoinformatics", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏗 FACULTY OF ENVIRONMENTAL SCIENCES", 
    name: "Department of Urban Planning",
    courses: [
      { name: "BSc Urban Planning", type: "BSc" },
      { name: "MSc Urban Planning", type: "MSc" },
      { name: "PhD Urban Planning", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏗 FACULTY OF ENVIRONMENTAL SCIENCES", 
    name: "Department of Environmental Management",
    courses: [
      { name: "BSc Environmental Management", type: "BSc" },
      { name: "MSc Environmental Management", type: "MSc" },
      { name: "PhD Environmental Management", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏗 FACULTY OF ENVIRONMENTAL SCIENCES", 
    name: "Department of Landscape Architecture",
    courses: [
      { name: "BSc Landscape Architecture", type: "BSc" },
      { name: "MSc Landscape Architecture", type: "MSc" },
      { name: "PhD Landscape Architecture", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏗 FACULTY OF ENVIRONMENTAL SCIENCES", 
    name: "Department of Interior Design",
    courses: [
      { name: "BSc Interior Design", type: "BSc" },
      { name: "MSc Interior Design", type: "MSc" },
      { name: "PhD Interior Design", type: "PhD" }
    ]
  },
  { 
    facultyName: "🏗 FACULTY OF ENVIRONMENTAL SCIENCES", 
    name: "Department of Construction Management",
    courses: [
      { name: "BSc Construction Management", type: "BSc" },
      { name: "MSc Construction Management", type: "MSc" },
      { name: "PhD Construction Management", type: "PhD" }
    ]
  },

  // FACULTY OF INFORMATION & DIGITAL TECHNOLOGIES
  { 
    facultyName: "💻 FACULTY OF INFORMATION & DIGITAL TECHNOLOGIES", 
    name: "Department of Information Technology",
    courses: [
      { name: "BSc Information Technology", type: "BSc" },
      { name: "MSc Information Technology", type: "MSc" },
      { name: "PhD Information Technology", type: "PhD" }
    ]
  },
  { 
    facultyName: "💻 FACULTY OF INFORMATION & DIGITAL TECHNOLOGIES", 
    name: "Department of Cloud Computing",
    courses: [
      { name: "BSc Cloud Computing", type: "BSc" },
      { name: "MSc Cloud Computing", type: "MSc" },
      { name: "PhD Cloud Computing", type: "PhD" }
    ]
  },
  { 
    facultyName: "💻 FACULTY OF INFORMATION & DIGITAL TECHNOLOGIES", 
    name: "Department of Blockchain Technology",
    courses: [
      { name: "BSc Blockchain Technology", type: "BSc" },
      { name: "MSc Blockchain Technology", type: "MSc" },
      { name: "PhD Blockchain Technology", type: "PhD" }
    ]
  },
  { 
    facultyName: "💻 FACULTY OF INFORMATION & DIGITAL TECHNOLOGIES", 
    name: "Department of Robotics",
    courses: [
      { name: "BSc Robotics", type: "BSc" },
      { name: "MSc Robotics", type: "MSc" },
      { name: "PhD Robotics", type: "PhD" }
    ]
  },
  { 
    facultyName: "💻 FACULTY OF INFORMATION & DIGITAL TECHNOLOGIES", 
    name: "Department of Internet of Things",
    courses: [
      { name: "BSc Internet of Things", type: "BSc" },
      { name: "MSc Internet of Things", type: "MSc" },
      { name: "PhD Internet of Things", type: "PhD" }
    ]
  },
  { 
    facultyName: "💻 FACULTY OF INFORMATION & DIGITAL TECHNOLOGIES", 
    name: "Department of Game Development",
    courses: [
      { name: "BSc Game Development", type: "BSc" },
      { name: "MSc Game Development", type: "MSc" },
      { name: "PhD Game Development", type: "PhD" }
    ]
  },
  { 
    facultyName: "💻 FACULTY OF INFORMATION & DIGITAL TECHNOLOGIES", 
    name: "Department of UI/UX Design",
    courses: [
      { name: "BSc UI/UX Design", type: "BSc" },
      { name: "MSc UI/UX Design", type: "MSc" },
      { name: "PhD UI/UX Design", type: "PhD" }
    ]
  },
  { 
    facultyName: "💻 FACULTY OF INFORMATION & DIGITAL TECHNOLOGIES", 
    name: "Department of Digital Marketing",
    courses: [
      { name: "BSc Digital Marketing", type: "BSc" },
      { name: "MSc Digital Marketing", type: "MSc" },
      { name: "PhD Digital Marketing", type: "PhD" }
    ]
  },
  { 
    facultyName: "💻 FACULTY OF INFORMATION & DIGITAL TECHNOLOGIES", 
    name: "Department of E-Commerce",
    courses: [
      { name: "BSc E-Commerce", type: "BSc" },
      { name: "MSc E-Commerce", type: "MSc" },
      { name: "PhD E-Commerce", type: "PhD" }
    ]
  },
  { 
    facultyName: "💻 FACULTY OF INFORMATION & DIGITAL TECHNOLOGIES", 
    name: "Department of Business Analytics",
    courses: [
      { name: "BSc Business Analytics", type: "BSc" },
      { name: "MSc Business Analytics", type: "MSc" },
      { name: "PhD Business Analytics", type: "PhD" }
    ]
  },

  // FACULTY OF TRANSPORT & LOGISTICS
  { 
    facultyName: "🚢 FACULTY OF TRANSPORT & LOGISTICS", 
    name: "Department of Transportation Management",
    courses: [
      { name: "BSc Transportation Management", type: "BSc" },
      { name: "MSc Transportation Management", type: "MSc" },
      { name: "PhD Transportation Management", type: "PhD" }
    ]
  },
  { 
    facultyName: "🚢 FACULTY OF TRANSPORT & LOGISTICS", 
    name: "Department of Aviation Management",
    courses: [
      { name: "BSc Aviation Management", type: "BSc" },
      { name: "MSc Aviation Management", type: "MSc" },
      { name: "PhD Aviation Management", type: "PhD" }
    ]
  },
  { 
    facultyName: "🚢 FACULTY OF TRANSPORT & LOGISTICS", 
    name: "Department of Maritime Studies",
    courses: [
      { name: "BSc Maritime Studies", type: "BSc" },
      { name: "MSc Maritime Studies", type: "MSc" },
      { name: "PhD Maritime Studies", type: "PhD" }
    ]
  },
  { 
    facultyName: "🚢 FACULTY OF TRANSPORT & LOGISTICS", 
    name: "Department of Railway Engineering",
    courses: [
      { name: "BSc Railway Engineering", type: "BSc" },
      { name: "MSc Railway Engineering", type: "MSc" },
      { name: "PhD Railway Engineering", type: "PhD" }
    ]
  },
  { 
    facultyName: "🚢 FACULTY OF TRANSPORT & LOGISTICS", 
    name: "Department of Logistics Engineering",
    courses: [
      { name: "BSc Logistics Engineering", type: "BSc" },
      { name: "MSc Logistics Engineering", type: "MSc" },
      { name: "PhD Logistics Engineering", type: "PhD" }
    ]
  },
  { 
    facultyName: "🚢 FACULTY OF TRANSPORT & LOGISTICS", 
    name: "Department of Fleet Management",
    courses: [
      { name: "BSc Fleet Management", type: "BSc" },
      { name: "MSc Fleet Management", type: "MSc" },
      { name: "PhD Fleet Management", type: "PhD" }
    ]
  },
  { 
    facultyName: "🚢 FACULTY OF TRANSPORT & LOGISTICS", 
    name: "Department of Port Management",
    courses: [
      { name: "BSc Port Management", type: "BSc" },
      { name: "MSc Port Management", type: "MSc" },
      { name: "PhD Port Management", type: "PhD" }
    ]
  },
  { 
    facultyName: "🚢 FACULTY OF TRANSPORT & LOGISTICS", 
    name: "Department of Supply Chain Analytics",
    courses: [
      { name: "BSc Supply Chain Analytics", type: "BSc" },
      { name: "MSc Supply Chain Analytics", type: "MSc" },
      { name: "PhD Supply Chain Analytics", type: "PhD" }
    ]
  },

  // FACULTY OF CREATIVE & MEDIA TECHNOLOGIES
  { 
    facultyName: "🎭 FACULTY OF CREATIVE & MEDIA TECHNOLOGIES", 
    name: "Department of Film Production",
    courses: [
      { name: "BSc Film Production", type: "BSc" },
      { name: "MSc Film Production", type: "MSc" },
      { name: "PhD Film Production", type: "PhD" }
    ]
  },
  { 
    facultyName: "🎭 FACULTY OF CREATIVE & MEDIA TECHNOLOGIES", 
    name: "Department of Cinematography",
    courses: [
      { name: "BSc Cinematography", type: "BSc" },
      { name: "MSc Cinematography", type: "MSc" },
      { name: "PhD Cinematography", type: "PhD" }
    ]
  },
  { 
    facultyName: "🎭 FACULTY OF CREATIVE & MEDIA TECHNOLOGIES", 
    name: "Department of Animation",
    courses: [
      { name: "BSc Animation", type: "BSc" },
      { name: "MSc Animation", type: "MSc" },
      { name: "PhD Animation", type: "PhD" }
    ]
  },
  { 
    facultyName: "🎭 FACULTY OF CREATIVE & MEDIA TECHNOLOGIES", 
    name: "Department of Multimedia Technology",
    courses: [
      { name: "BSc Multimedia Technology", type: "BSc" },
      { name: "MSc Multimedia Technology", type: "MSc" },
      { name: "PhD Multimedia Technology", type: "PhD" }
    ]
  },
  { 
    facultyName: "🎭 FACULTY OF CREATIVE & MEDIA TECHNOLOGIES", 
    name: "Department of Sound Engineering",
    courses: [
      { name: "BSc Sound Engineering", type: "BSc" },
      { name: "MSc Sound Engineering", type: "MSc" },
      { name: "PhD Sound Engineering", type: "PhD" }
    ]
  },
  { 
    facultyName: "🎭 FACULTY OF CREATIVE & MEDIA TECHNOLOGIES", 
    name: "Department of Digital Photography",
    courses: [
      { name: "BSc Digital Photography", type: "BSc" },
      { name: "MSc Digital Photography", type: "MSc" },
      { name: "PhD Digital Photography", type: "PhD" }
    ]
  },
  { 
    facultyName: "🎭 FACULTY OF CREATIVE & MEDIA TECHNOLOGIES", 
    name: "Department of Content Creation",
    courses: [
      { name: "BSc Content Creation", type: "BSc" },
      { name: "MSc Content Creation", type: "MSc" },
      { name: "PhD Content Creation", type: "PhD" }
    ]
  },
  { 
    facultyName: "🎭 FACULTY OF CREATIVE & MEDIA TECHNOLOGIES", 
    name: "Department of Advertising",
    courses: [
      { name: "BSc Advertising", type: "BSc" },
      { name: "MSc Advertising", type: "MSc" },
      { name: "PhD Advertising", type: "PhD" }
    ]
  },

  // FACULTY OF ADVANCED RESEARCH & INNOVATION
  { 
    facultyName: "🔬 FACULTY OF ADVANCED RESEARCH & INNOVATION", 
    name: "Department of Nanotechnology",
    courses: [
      { name: "BSc Nanotechnology", type: "BSc" },
      { name: "MSc Nanotechnology", type: "MSc" },
      { name: "PhD Nanotechnology", type: "PhD" }
    ]
  },
  { 
    facultyName: "🔬 FACULTY OF ADVANCED RESEARCH & INNOVATION", 
    name: "Department of Renewable Energy",
    courses: [
      { name: "BSc Renewable Energy", type: "BSc" },
      { name: "MSc Renewable Energy", type: "MSc" },
      { name: "PhD Renewable Energy", type: "PhD" }
    ]
  },
  { 
    facultyName: "🔬 FACULTY OF ADVANCED RESEARCH & INNOVATION", 
    name: "Department of Space Science",
    courses: [
      { name: "BSc Space Science", type: "BSc" },
      { name: "MSc Space Science", type: "MSc" },
      { name: "PhD Space Science", type: "PhD" }
    ]
  },
  { 
    facultyName: "🔬 FACULTY OF ADVANCED RESEARCH & INNOVATION", 
    name: "Department of Climate Change Studies",
    courses: [
      { name: "BSc Climate Change Studies", type: "BSc" },
      { name: "MSc Climate Change Studies", type: "MSc" },
      { name: "PhD Climate Change Studies", type: "PhD" }
    ]
  },
  { 
    facultyName: "🔬 FACULTY OF ADVANCED RESEARCH & INNOVATION", 
    name: "Department of Artificial Intelligence Research",
    courses: [
      { name: "BSc Artificial Intelligence Research", type: "BSc" },
      { name: "MSc Artificial Intelligence Research", type: "MSc" },
      { name: "PhD Artificial Intelligence Research", type: "PhD" }
    ]
  },
  { 
    facultyName: "🔬 FACULTY OF ADVANCED RESEARCH & INNOVATION", 
    name: "Department of Biotechnology Research",
    courses: [
      { name: "BSc Biotechnology Research", type: "BSc" },
      { name: "MSc Biotechnology Research", type: "MSc" },
      { name: "PhD Biotechnology Research", type: "PhD" }
    ]
  },
  { 
    facultyName: "🔬 FACULTY OF ADVANCED RESEARCH & INNOVATION", 
    name: "Department of Smart Systems Engineering",
    courses: [
      { name: "BSc Smart Systems Engineering", type: "BSc" },
      { name: "MSc Smart Systems Engineering", type: "MSc" },
      { name: "PhD Smart Systems Engineering", type: "PhD" }
    ]
  },
  { 
    facultyName: "🔬 FACULTY OF ADVANCED RESEARCH & INNOVATION", 
    name: "Department of Quantum Computing",
    courses: [
      { name: "BSc Quantum Computing", type: "BSc" },
      { name: "MSc Quantum Computing", type: "MSc" },
      { name: "PhD Quantum Computing", type: "PhD" }
    ]
  },

  // FACULTY OF PROFESSIONAL STUDIES
  { 
    facultyName: "📊 FACULTY OF PROFESSIONAL STUDIES", 
    name: "Department of Leadership Studies",
    courses: [
      { name: "BSc Leadership Studies", type: "BSc" },
      { name: "MSc Leadership Studies", type: "MSc" },
      { name: "PhD Leadership Studies", type: "PhD" }
    ]
  },
  { 
    facultyName: "📊 FACULTY OF PROFESSIONAL STUDIES", 
    name: "Department of Corporate Governance",
    courses: [
      { name: "BSc Corporate Governance", type: "BSc" },
      { name: "MSc Corporate Governance", type: "MSc" },
      { name: "PhD Corporate Governance", type: "PhD" }
    ]
  },
  { 
    facultyName: "📊 FACULTY OF PROFESSIONAL STUDIES", 
    name: "Department of Risk Management",
    courses: [
      { name: "BSc Risk Management", type: "BSc" },
      { name: "MSc Risk Management", type: "MSc" },
      { name: "PhD Risk Management", type: "PhD" }
    ]
  },
  { 
    facultyName: "📊 FACULTY OF PROFESSIONAL STUDIES", 
    name: "Department of Financial Technology (FinTech)",
    courses: [
      { name: "BSc Financial Technology (FinTech)", type: "BSc" },
      { name: "MSc Financial Technology (FinTech)", type: "MSc" },
      { name: "PhD Financial Technology (FinTech)", type: "PhD" }
    ]
  },
  { 
    facultyName: "📊 FACULTY OF PROFESSIONAL STUDIES", 
    name: "Department of Compliance & Regulation",
    courses: [
      { name: "BSc Compliance & Regulation", type: "BSc" },
      { name: "MSc Compliance & Regulation", type: "MSc" },
      { name: "PhD Compliance & Regulation", type: "PhD" }
    ]
  },
  { 
    facultyName: "📊 FACULTY OF PROFESSIONAL STUDIES", 
    name: "Department of Business Law",
    courses: [
      { name: "BSc Business Law", type: "BSc" },
      { name: "MSc Business Law", type: "MSc" },
      { name: "PhD Business Law", type: "PhD" }
    ]
  },
  { 
    facultyName: "📊 FACULTY OF PROFESSIONAL STUDIES", 
    name: "Department of Digital Transformation",
    courses: [
      { name: "BSc Digital Transformation", type: "BSc" },
      { name: "MSc Digital Transformation", type: "MSc" },
      { name: "PhD Digital Transformation", type: "PhD" }
    ]
  },
  { 
    facultyName: "📊 FACULTY OF PROFESSIONAL STUDIES", 
    name: "Department of Innovation Management",
    courses: [
      { name: "BSc Innovation Management", type: "BSc" },
      { name: "MSc Innovation Management", type: "MSc" },
      { name: "PhD Innovation Management", type: "PhD" }
    ]
  }
];

module.exports = {
  facultiesData,
  departmentsData
};
