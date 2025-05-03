document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const form = document.getElementById('applicationForm');
    const existingFrameworkRadios = document.querySelectorAll('input[name="existingFramework"]');
    const existingFrameworksContainer = document.getElementById('existingFrameworksContainer');
    const priorityCheckboxes = document.querySelectorAll('input[name="priority"]');
    const priorityWarning = document.getElementById('priorityWarning');
    const notificationEl = document.getElementById('notification');
    const recommendationPanel = document.getElementById('recommendationPanel');
    
    // Toggle existing frameworks section based on radio selection
    existingFrameworkRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            existingFrameworksContainer.style.display = (this.value === 'yes') ? 'block' : 'none';
        });
    });
    
    // Limit priority checkboxes to 2 selections
    priorityCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedPriorities = document.querySelectorAll('input[name="priority"]:checked');
            
            if (checkedPriorities.length > 2) {
                this.checked = false;
                priorityWarning.style.display = 'block';
                setTimeout(() => {
                    priorityWarning.style.display = 'none';
                }, 3000);
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        const applicationType = document.getElementById('applicationType').value;
        const teamExpertise = document.getElementById('teamExpertise').value;
        const projectScope = document.getElementById('projectScope').value;
        const repoStrategy = document.getElementById('repoStrategy').value;
        
        if (!applicationType || !teamExpertise || !projectScope || !repoStrategy) {
            showNotification('Please fill out all required fields.', 'error');
            return;
        }
        
        // Get form data
        const formData = {
            applicationType: applicationType,
            teamExpertise: teamExpertise,
            existingFramework: document.querySelector('input[name="existingFramework"]:checked')?.value || '',
            existingFrameworkType: document.getElementById('existingFrameworks').value,
            existingTestCount: document.getElementById('existingTestCount').value,
            priorities: Array.from(document.querySelectorAll('input[name="priority"]:checked')).map(el => el.value),
            projectScope: projectScope,
            repoStrategy: repoStrategy
        };
        
        // Generate recommendations
        generateRecommendations(formData);
        
        // Show success notification
        showNotification('Recommendations generated successfully!', 'success');
        
        // Scroll to recommendations
        recommendationPanel.scrollIntoView({ behavior: 'smooth' });
    });
    
    function showNotification(message, type) {
        notificationEl.textContent = message;
        notificationEl.className = `notification ${type}`;
        notificationEl.style.display = 'block';
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notificationEl.style.display = 'none';
        }, 3000);
    }
    
    // Generate recommendations based on form data
    function generateRecommendations(data) {
        // Clear previous recommendations
        document.getElementById('frameworkList').innerHTML = '';
        document.getElementById('languageList').innerHTML = '';
        document.getElementById('toolsList').innerHTML = '';
        document.getElementById('practicesList').innerHTML = '';
        
        // Show recommendation panel
        recommendationPanel.style.display = 'block';
        
        // Default recommendations
        let framework = [];
        let language = [];
        let tools = [];
        let practices = [];
        
        // Check if we should stick with existing framework
        if (data.existingFramework === 'yes' && data.existingFrameworkType && parseInt(data.existingTestCount) > 50) {
            framework.push(`Continue with your existing ${data.existingFrameworkType} framework as you have a significant test suite`);
            framework.push(`Focus on improving your current implementation rather than migrating`);
            
            // Add framework-specific advice
            switch(data.existingFrameworkType) {
                case 'selenium':
                    tools.push(`Consider adopting WebDriverManager for easier driver management`);
                    tools.push(`Add Extent Reports or Allure for better reporting`);
                    practices.push(`Implement explicit waits consistently to improve reliability`);
                    break;
                case 'cypress':
                    tools.push(`Add Cypress Testing Library for better selectors`);
                    tools.push(`Consider Cypress Cloud for parallel execution`);
                    practices.push(`Utilize custom commands for repetitive operations`);
                    break;
                case 'playwright':
                    tools.push(`Enable Playwright's trace viewer for debugging`);
                    tools.push(`Utilize built-in API mocking capabilities`);
                    practices.push(`Leverage web-first assertions for better stability`);
                    break;
                default:
                    tools.push(`Research the latest plugins and extensions for ${data.existingFrameworkType}`);
                    practices.push(`Follow the official documentation for best practices`);
            }
            
            practices.push(`Consider implementing a test health monitoring system`);
            practices.push(`Regularly refactor tests to maintain quality`);
            
            // Add remaining recommendations
            populateRecommendationLists(framework, language, tools, practices);
            return;
        }
        
        // Make recommendations based on application type and team expertise
        switch(data.applicationType) {
            case 'web_ui':
                if (data.teamExpertise === 'javascript' || data.teamExpertise === 'typescript') {
                    framework = [
                        'Cypress is recommended for its excellent developer experience',
                        'Offers real-time browser feedback and intuitive API',
                        'Built-in waiting mechanisms reduce flaky tests'
                    ];
                    
                    language = [
                        data.teamExpertise === 'typescript' ? 
                            'TypeScript for improved type safety and code completion' : 
                            'JavaScript with modern ES6+ syntax',
                        'Mocha-based test structure that is familiar and easy to learn'
                    ];
                    
                    tools = [
                        'Cypress Testing Library for better selector practices',
                        'Cypress-Axe for accessibility testing',
                        'Mochawesome reporter for beautiful test reports'
                    ];
                } else if (data.teamExpertise === 'java') {
                    framework = [
                        'Selenium with Java provides robust browser testing',
                        'Industry standard with mature ecosystem and wide browser support',
                        'Strong community and extensive documentation'
                    ];
                    
                    language = [
                        'Java 11+ with TestNG or JUnit 5',
                        'Strongly-typed language ideal for large-scale test suites'
                    ];
                    
                    tools = [
                        'WebDriverManager for automatic driver management',
                        'AssertJ for fluent assertions',
                        'Allure Reports for comprehensive test reporting'
                    ];
                } else if (data.teamExpertise === 'python') {
                    framework = [
                        'Playwright with Python for modern browser automation',
                        'Auto-waiting capabilities and native support for modern web features',
                        'Works across all modern browsers with a unified API'
                    ];
                    
                    language = [
                        'Python 3.7+ with Pytest',
                        'Readable syntax and powerful assertion capabilities'
                    ];
                    
                    tools = [
                        'pytest-xdist for parallel test execution',
                        'pytest-html for detailed HTML reports',
                        'Faker for test data generation'
                    ];
                } else if (data.teamExpertise === 'csharp') {
                    framework = [
                        'Playwright for C# provides modern browser automation',
                        'Strong typing with excellent IDE integration',
                        'Works well with the .NET ecosystem'
                    ];
                    
                    language = [
                        'C# with NUnit or xUnit',
                        '.NET 6+ for modern language features'
                    ];
                    
                    tools = [
                        'FluentAssertions for readable assertions',
                        'Bogus for test data generation',
                        'Allure or ExtentReports for reporting'
                    ];
                }
                
                practices = [
                    'Implement the Page Object Model for maintainable test organization',
                    'Use data-testid attributes for stable element selectors',
                    'Store test data in fixtures/external files to keep tests clean',
                    'Implement visual regression testing for UI components'
                ];
                break;
                
            case 'rest_api':
                if (data.teamExpertise === 'java') {
                    framework = [
                        'REST Assured for Java API testing',
                        'Fluent API with excellent JSON and XML support',
                        'Integrates well with TestNG and JUnit'
                    ];
                    
                    language = [
                        'Java 11+ with declarative test style',
                        'TestNG for test organization and parallelization'
                    ];
                    
                    tools = [
                        'Jackson for JSON manipulation',
                        'Awaitility for asynchronous testing',
                        'WireMock for service virtualization'
                    ];
                } else if (data.teamExpertise === 'javascript' || data.teamExpertise === 'typescript') {
                    framework = [
                        'Supertest with Jest/Mocha for JavaScript API testing',
                        'Simple syntax for HTTP assertions',
                        'Works well with modern JavaScript frameworks'
                    ];
                    
                    language = [
                        data.teamExpertise === 'typescript' ? 
                            'TypeScript for type-safe requests and responses' : 
                            'JavaScript with async/await for clean API calls',
                        'Jest for its built-in assertion library and mocking'
                    ];
                    
                    tools = [
                        'Faker.js for generating test data',
                        'nock for HTTP request mocking',
                        'newman for running Postman collections programmatically'
                    ];
                } else if (data.teamExpertise === 'python') {
                    framework = [
                        'Requests with Pytest for Python API testing',
                        'Simple and intuitive API for HTTP requests',
                        'PyTest fixtures for test setup and teardown'
                    ];
                    
                    language = [
                        'Python 3.7+ with pytest fixtures',
                        'Readable syntax and powerful assertion capabilities'
                    ];
                    
                    tools = [
                        'pytest-httpserver for mock HTTP servers',
                        'jsonschema for response validation',
                        'pytest-html for detailed reporting'
                    ];
                } else if (data.teamExpertise === 'csharp') {
                    framework = [
                        'RestSharp with xUnit for C# API testing',
                        'Straightforward HTTP client with good serialization',
                        'Works well with the .NET ecosystem'
                    ];
                    
                    language = [
                        'C# with xUnit or NUnit',
                        '.NET 6+ for modern HTTP client features'
                    ];
                    
                    tools = [
                        'FluentAssertions for readable assertions',
                        'WireMock.NET for service mocking',
                        'Newtonsoft.Json for advanced JSON handling'
                    ];
                }
                
                practices = [
                    'Use contract testing for API validation',
                    'Implement test data management strategy',
                    'Structure tests by resources or endpoints',
                    'Include negative testing scenarios and edge cases'
                ];
                break;
                
            case 'fullstack':
                if (data.teamExpertise === 'javascript' || data.teamExpertise === 'typescript') {
                    framework = [
                        'Playwright for end-to-end testing',
                        'Jest for component and API testing',
                        'Powerful tooling for both UI and API layers'
                    ];
                    
                    language = [
                        data.teamExpertise === 'typescript' ? 
                            'TypeScript for fully type-safe tests' : 
                            'JavaScript with ES6+ features',
                        'Consistent language across all test layers'
                    ];
                    
                    tools = [
                        'MSW (Mock Service Worker) for API mocking',
                        'Testing Library for component tests',
                        'Playwright Test for parallel execution'
                    ];
                } else if (data.teamExpertise === 'java') {
                    framework = [
                        'Karate DSL for combined API and UI testing',
                        'Unified framework with BDD style syntax',
                        'Can handle both UI and API within same test suite'
                    ];
                    
                    language = [
                        'Java with Karate\'s custom DSL',
                        'Gherkin syntax for readable specifications'
                    ];
                    
                    tools = [
                        'Cucumber reporting',
                        'Gatling for performance testing integration',
                        'Built-in parallel execution engine'
                    ];
                } else if (data.teamExpertise === 'python') {
                    framework = [
                        'Playwright for UI testing, Requests for API',
                        'pytest as the test runner for both layers',
                        'Unified Python ecosystem for all testing needs'
                    ];
                    
                    language = [
                        'Python 3.7+ with Pytest',
                        'Use fixtures to share setup between API and UI tests'
                    ];
                    
                    tools = [
                        'pytest-xdist for parallel execution',
                        'pytest-bdd for behavior-driven tests',
                        'Allure for comprehensive reporting across layers'
                    ];
                } else if (data.teamExpertise === 'csharp') {
                    framework = [
                        'Playwright for UI, RestSharp for API testing',
                        'SpecFlow for BDD-style specifications',
                        'Unified C# approach across test layers'
                    ];
                    
                    language = [
                        'C# with xUnit or SpecFlow',
                        '.NET 6+ for modern language features'
                    ];
                    
                    tools = [
                        'FluentAssertions for readable assertions',
                        'WireMock.NET for service virtualization',
                        'Living Documentation for BDD'
                    ];
                }
                
                practices = [
                    'Create a testing pyramid with more unit/API tests than UI tests',
                    'Share utilities and helper functions across test types',
                    'Implement environment configuration for different test environments',
                    'Use the same test data generation strategy across layers'
                ];
                break;

            case 'mobile':
                if (data.teamExpertise === 'java') {
                    framework = [
                        'Appium with Java for cross-platform mobile testing',
                        'WebDriverIO for UI element interactions',
                        'Cross-platform support for iOS and Android'
                    ];
                    
                    language = [
                        'Java 11+ with TestNG for test organization',
                        'Strong typing and robust mobile element handling'
                    ];
                    
                    tools = [
                        'Appium Inspector for element identification',
                        'Extent Reports for visual reporting',
                        'TestNG for parallel test execution'
                    ];
                } else if (data.teamExpertise === 'javascript' || data.teamExpertise === 'typescript') {
                    framework = [
                        'Appium with WebdriverIO for mobile testing',
                        'Intuitive API with excellent JavaScript support',
                        'Cross-platform solution with active community'
                    ];
                    
                    language = [
                        data.teamExpertise === 'typescript' ? 
                            'TypeScript for type-safe mobile tests' : 
                            'JavaScript with Mocha test framework',
                        'Modern async/await syntax for handling mobile operations'
                    ];
                    
                    tools = [
                        'Appium Inspector for element identification',
                        'Allure reporting for test results',
                        'WebdriverIO's visual testing capabilities'
                    ];
                } else if (data.teamExpertise === 'python') {
                    framework = [
                        'Appium with Python for mobile test automation',
                        'Pytest as the test runner',
                        'Cross-platform support with simple syntax'
                    ];
                    
                    language = [
                        'Python 3.7+ with pytest',
                        'Readable and maintainable test code'
                    ];
                    
                    tools = [
                        'Appium-Python-Client library',
                        'Allure for comprehensive reporting',
                        'Pytest fixtures for test organization'
                    ];
                }
                
                practices = [
                    'Implement a robust element identification strategy',
                    'Use a device farm for testing across multiple devices',
                    'Handle different screen sizes and orientations',
                    'Implement proper app state management between tests'
                ];
                break;
                
            case 'microservices':
                if (data.teamExpertise === 'java') {
                    framework = [
                        'Spring Cloud Contract for consumer-driven contracts',
                        'REST Assured for API testing',
                        'Pact for service virtualization'
                    ];
                    
                    language = [
                        'Java 11+ with Spring Boot Test',
                        'JUnit 5 for test organization'
                    ];
                    
                    tools = [
                        'Testcontainers for isolated service testing',
                        'WireMock for service virtualization',
                        'Karate for BDD-style API testing'
                    ];
                } else if (data.teamExpertise === 'javascript' || data.teamExpertise === 'typescript') {
                    framework = [
                        'Jest for unit and integration testing',
                        'Pactum.js for contract testing',
                        'SuperTest for API testing'
                    ];
                    
                    language = [
                        data.teamExpertise === 'typescript' ? 
                            'TypeScript for type-safe microservice tests' : 
                            'JavaScript with Node.js testing libraries',
                        'Consistent language across service boundaries'
                    ];
                    
                    tools = [
                        'Pact for consumer-driven contract testing',
                        'Docker Compose for integration testing',
                        'Istanbul for code coverage'
                    ];
                } else if (data.teamExpertise === 'python') {
                    framework = [
                        'Pytest for unit and integration testing',
                        'Tavern for API testing',
                        'Pact for contract testing'
                    ];
                    
                    language = [
                        'Python 3.7+ with pytest',
                        'FastAPI or Flask test clients'
                    ];
                    
                    tools = [
                        'Docker Compose for integration testing',
                        'pytest-cov for code coverage',
                        'Hypothesis for property-based testing'
                    ];
                }
                
                practices = [
                    'Implement consumer-driven contract testing',
                    'Use service virtualization for dependent services',
                    'Maintain independent test suites for each microservice',
                    'Implement comprehensive integration tests for service boundaries'
                ];
                break;
        }
        
        // Adjust recommendations based on priorities
        if (data.priorities.includes('speed')) {
            tools.push('Focus on headless testing for faster execution');
            practices.push('Implement efficient test data setup and teardown');
        }
        
        if (data.priorities.includes('reliability')) {
            tools.push('Implement retry mechanisms for flaky tests');
            practices.push('Use stable test selectors and explicit waits');
        }
        
        if (data.priorities.includes('maintenance')) {
            tools.push('Invest in shared test utilities and patterns');
            practices.push('Implement detailed logging for easier debugging');
        }
        
        if (data.priorities.includes('ci_integration')) {
            tools.push('Docker containers for consistent CI environments');
            practices.push('Implement test reports that integrate with CI dashboards');
        }
        
        if (data.priorities.includes('readability')) {
            tools.push('Use BDD frameworks for business-readable tests');
            practices.push('Implement custom matchers and assertions for domain concepts');
        }
        
        if (data.priorities.includes('parallel')) {
            tools.push('Grid infrastructure for distributed test execution');
            practices.push('Design tests to be stateless and independent');
        }
        
        // Adjust recommendations based on project scope
        if (data.projectScope === 'large') {
            practices.push('Implement a shared testing framework across teams');
            practices.push('Establish testing standards and governance');
        }
        
        // Adjust recommendations based on repository strategy
        if (data.repoStrategy === 'monorepo') {
            practices.push('Leverage monorepo tooling for efficient test execution');
        } else if (data.repoStrategy === 'multi_repo') {
            practices.push('Implement shared test libraries as separate packages');
        } else if (data.repoStrategy === 'test_repo') {
            practices.push('Establish clear interfaces between test code and application code');
        }
        
        // Populate recommendation lists
        populateRecommendationLists(framework, language, tools, practices);
    }
    
    // Helper function to populate recommendation lists
    function populateRecommendationLists(framework, language, tools, practices) {
        const frameworkList = document.getElementById('frameworkList');
        const languageList = document.getElementById('languageList');
        const toolsList = document.getElementById('toolsList');
        const practicesList = document.getElementById('practicesList');
        
        // Populate framework recommendations
        framework.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            frameworkList.appendChild(li);
        });
        
        // Populate language recommendations
        language.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            languageList.appendChild(li);
        });
        
        // Populate tools recommendations
        tools.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            toolsList.appendChild(li);
        });
        
        // Populate practices recommendations
        practices.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            practicesList.appendChild(li);
        });
    }
});
