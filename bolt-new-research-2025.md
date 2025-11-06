# Comprehensive Research Report: bolt.new (October 2025)

**Research Date:** October 29, 2025
**Subject:** bolt.new by StackBlitz
**Original Launch:** October 2024 at ViteConf 24

---

## Executive Summary

bolt.new is StackBlitz's AI-powered, browser-based full-stack web development platform that enables users to build, edit, and deploy complete web applications through natural language prompts. Launched in October 2024, it achieved remarkable success, reaching $20M ARR within two months and becoming one of the fastest-growing startups ever. As of 2025, the platform has evolved from an experimental tool to a production-ready platform with enterprise features, team collaboration, and extensive integrations.

**Key Achievement:** Over 1 million websites built and deployed by March 2025.

---

## 1. Core Functionality: What Users Can Build

### Primary Use Cases

bolt.new enables users to build:

- **Full-Stack Web Applications**: Complete applications with frontend and backend using modern JavaScript frameworks
- **Progressive Web Apps (PWAs)**: Mobile-first experiences that work without app store approval
- **Mobile Applications**: iOS and Android apps using Expo and React Native (integration launched February 2025)
- **SaaS MVPs**: Minimum viable products with databases, authentication, and payment integration
- **Interactive Prototypes**: Rapid prototyping for product teams and designers
- **Landing Pages**: Business landing pages with CRM integration
- **Community Platforms**: Discussion boards and niche community sites
- **Interactive Portfolios**: Developer portfolios with live demos and case studies
- **Business Tools**: Custom business applications, dashboards, and internal tools

### What Makes It Special

- **Natural Language to Code**: Users describe what they want in plain English, and the AI generates complete applications
- **Browser-Based**: No local installation or environment setup required
- **Complete Workflow**: Generate, edit, run, test, and deploy all in one platform
- **Instant Preview**: Real-time live preview with hot reload
- **One-Click Deployment**: Deploy to production hosting platforms instantly

### Best Suited For

- Rapid prototyping and MVPs
- Learning web development
- Non-technical founders validating ideas
- Freelancers building client projects quickly
- Product teams creating demos without engineering resources

### Not Suitable For

- Large-scale production applications with complex requirements
- Projects requiring non-JavaScript backend languages (Python, PHP, C#, etc.)
- Applications with deep database logic or real-time updates
- Projects exceeding context window limits (200K-500K tokens)

---

## 2. Code Generation Capabilities

### Supported Languages

**Supported:**
- JavaScript (ES6+)
- TypeScript
- HTML5
- CSS3/SCSS/Sass
- JSON

**Explicitly NOT Supported:**
- Python
- PHP
- C#
- C++
- Any non-web languages

### Supported Frameworks & Libraries

**Frontend Frameworks:**
- React
- Vue.js
- Next.js
- Astro
- Svelte/SvelteKit
- Remix
- Angular
- Vite

**Mobile Development:**
- Expo (for React Native)
- React Native (via Expo integration)

**Styling:**
- Tailwind CSS
- ShadCN UI
- Custom CSS/SCSS
- CSS-in-JS solutions

**Backend:**
- Node.js
- Express
- Full-stack meta-frameworks (Next.js, Remix, SvelteKit, Astro with SSR/SSG)

### Code Quality Features

- **Real-time Error Detection**: Identifies syntax and runtime errors instantly
- **Type Checking**: Full TypeScript support with type validation
- **Linting**: Integrated code quality checks
- **Auto-formatting**: Code formatting and syntax highlighting
- **Package Management**: Automatic npm/yarn package installation
- **Dependency Resolution**: Handles package conflicts automatically

---

## 3. AI Features

### AI Models Used

**Primary Model:**
- **Anthropic Claude 3.5 Sonnet**: Primary model for code generation (95% accuracy rate for complex applications)

**Additional Supported Models:**
- OpenAI GPT-4 family
- Multiple AI models available for routing

### AI Capabilities

**Code Generation:**
- Natural language understanding and code synthesis
- Complete project structure generation
- File and folder organization
- Configuration file creation (package.json, tsconfig.json, etc.)

**Development Assistance:**
- Error detection and auto-fix suggestions
- Code debugging assistance
- Discussion Mode: Debug without generating code
- Contextual code completion

**Project Management:**
- Package installation automation
- Build configuration
- Environment setup
- Third-party integrations orchestration

### AI Control Scope

The AI has complete control over:
- Filesystem operations
- Node.js server
- Package manager (npm/yarn)
- Terminal commands
- Browser console
- Deployment process

---

## 4. User Interface

### Main Interface Components

**Split-Screen Layout:**
- Left side: Chat interface for prompts and AI responses
- Middle: Code editor with file tree
- Right side: Live preview pane with browser simulation

### Chat Interface

- **Natural Language Input**: Conversational prompt-based development
- **Code Streaming**: Real-time code generation display
- **Discussion Mode**: Troubleshoot without generating code
- **Context-Aware**: Maintains conversation history and project context

### Code Editor Features

- **Syntax Highlighting**: Language-specific color coding
- **Multiple Cursors**: Edit multiple lines simultaneously
- **File Tree**: Visual project structure navigation
- **IntelliSense**: Code completion and suggestions
- **Error Highlighting**: Inline error and warning display
- **Search and Replace**: Find across files
- **Git-Like Version Tracking**: Project history management

### Integrated Terminal

- **Full Terminal Access**: Run bash commands
- **Package Management**: npm, yarn commands
- **Build Scripts**: Execute custom scripts
- **Log Output**: View console logs and errors
- **WebContainer Sandbox**: Isolated execution environment

### Live Preview

- **Real-Time Rendering**: Instant visual feedback
- **Hot Module Replacement (HMR)**: Changes reflect immediately without page reload
- **Browser DevTools**: Console inspection, network tab, element inspector
- **Responsive Testing**: Preview at different screen sizes
- **Mobile Preview**: Test mobile experiences with Expo Go (for mobile apps)

### Project Management

- **Project Dashboard**: Manage all projects in one place
- **Project Title Editing**: Rename projects easily
- **Export Options**: Download or share projects
- **Publish Options**: Deploy to production
- **Duplicate Projects**: Clone for new variations

---

## 5. Export/Deploy Options

### Export Capabilities

**Download as ZIP:**
1. Click project title in top-left
2. Select Export → Download
3. Receive complete project as .zip file

**What's Included in Export:**
- All source code files
- Configuration files (package.json, tsconfig.json, etc.)
- Assets and static files
- Documentation files
- Build configurations

### GitHub Integration

**Option 1: Chrome Extension (Bolt to GitHub)**
- Automated ZIP processing
- Direct upload to GitHub repositories
- Custom commit messages
- Automatic repository creation

**Option 2: Manual Git Push**
- Download project
- Initialize git repository locally
- Push to GitHub manually

**Option 3: Open GitHub Projects in Bolt**
- Prepend `bolt.new/` to any public GitHub URL
- Example: `bolt.new/~/github.com/username/repo`
- Opens project in bolt.new for AI-powered editing

### Deployment Options

**Built-in Deployment:**
- **Bolt Hosting**: Click "Publish" → Free .bolt.host domain
- Instant deployment
- HTTPS enabled by default
- No configuration required

**External Hosting Platforms:**
- **Netlify**: One-click integration
- **Vercel**: Seamless deployment
- **Cloudflare Pages**: Direct deployment
- **GitHub Pages**: Via bolt.diy
- **Custom Servers**: Via manual export

### Mobile App Deployment

**Expo Integration:**
- **Development Testing**: Expo Go app for instant device testing via QR code
- **EAS Build**: Production builds for iOS and Android
- **App Store Deployment**: Via EAS Submit (requires developer accounts)

---

## 6. In-Browser Development: WebContainers Technology

### What are WebContainers?

WebContainers is StackBlitz's groundbreaking WebAssembly-based "micro-operating system" that enables Node.js and the entire JavaScript ecosystem to run natively in the browser without servers, VMs, or cloud infrastructure.

### Technical Architecture

**Core Technology:**
- **WebAssembly Runtime**: OS-level virtualization in browser
- **Network Stack Emulation**: Full TCP/IP stack simulation in browser
- **File System**: Virtual filesystem with read/write capabilities
- **Process Management**: Multi-process support for Node.js

**How It Works:**
1. User submits natural language prompt
2. AI (Claude 3.5 Sonnet) generates application code
3. Middleware layer tracks file changes and manages packages
4. WebContainers execute Node.js environment in browser
5. Live preview renders in isolated iframe
6. Hot reload updates on code changes

### Performance Characteristics

**Advantages:**
- **Zero Setup Time**: No installation or configuration
- **Instant Boot**: Environment starts in seconds
- **No Package Conflicts**: Isolated environment per project
- **Local Compute**: Runs on user's machine, no cloud latency
- **Security**: Sandboxed execution prevents system access

**Limitations:**
- **Browser Resource Constraints**: Limited by available RAM/CPU
- **No Native Binaries**: Cannot run non-JavaScript compiled code
- **Network Restrictions**: Some APIs unavailable in browser context

### Supported Operations

- npm/yarn package installation
- Node.js server execution
- Build tools (Vite, Webpack, etc.)
- Development servers
- File system operations
- Terminal commands
- Environment variable management

---

## 7. Collaboration Features

### Bolt Teams Plan (Launched 2025)

**Core Collaboration Features:**
- **One-Click Invitations**: Easy teammate onboarding
- **Real-Time Editing**: Simultaneous multi-user editing
- **Role-Based Permissions**: Granular access control
- **Admin Controls**: Centralized team management
- **Shared Workspaces**: Team-level project organization

### Access Control

**Permission Levels:**
- **View**: Read-only access to projects
- **Edit**: Modify code and configurations
- **Manage**: Project settings and member management
- **Admin**: Full team administration and billing

### Administrative Features

- **Centralized Billing**: Single invoice for entire team
- **Token Usage Tracking**: Monitor per-member token consumption
- **Audit Capabilities**: Track changes and activity
- **Member Management**: Add/remove team members

### Integration Features

**GitHub Integration:**
- Team-level repository access
- Shared commit history
- Collaborative code reviews

**Figma Integration:**
- Import Figma designs for entire team
- Shared design-to-code workflows
- Collaborative prototyping

### Sharing & Publishing

**Project Sharing:**
- Share live previews with stakeholders
- Public project URLs
- Embed previews in presentations

**Version Control:**
- Project duplication for versioning
- Chat history per project
- Rollback capabilities via project duplication

---

## 8. Pricing/Plans

### Free Tier

**Token Allocation:**
- 2.5M tokens per month total
- 300K daily token limit

**Features:**
- Access to all core features
- Browser-based IDE
- WebContainers technology
- Export and download capabilities
- Deploy to .bolt.host
- AI model access (Claude, GPT-4)

**Limitations:**
- Lower context window (200K tokens)
- Daily usage caps
- Not suitable for production use
- Frequent context window limits on larger projects

### Pro Plan - $20/month

**Token Allocation:**
- 10 million tokens per month
- No daily limits

**Features:**
- All Free tier features
- Larger context window (500K tokens)
- Priority AI model access
- Faster performance
- Extended project capabilities

**Best For:**
- Individual developers
- Freelancers
- Side projects
- Serious prototyping

### Teams Plan - $30/user/month

**Token Allocation:**
- 10 million tokens per user per month
- Tokens NOT shared between members

**Features:**
- All Pro tier features
- Team collaboration tools
- Real-time multi-user editing
- Role-based permissions
- Admin controls
- Centralized billing
- Token usage tracking per member
- GitHub and Figma integrations

**Best For:**
- Development teams
- Agencies
- Product teams
- Startups

### Enterprise Plan - Custom Pricing

**Enhanced Features:**
- Custom token allocations
- SSO (Single Sign-On)
- SAML authentication (availability unclear)
- Audit logs
- Compliance options
- Dedicated support
- Custom infrastructure
- SLA guarantees
- Priority feature requests

**Best For:**
- Large organizations
- Regulated industries
- Companies requiring compliance
- High-volume users

### Token Economics

**What Consumes Tokens:**
- AI code generation
- Prompt processing
- Code debugging
- Error fixing iterations
- Discussion mode queries

**Token Management Tips:**
- Use Discussion Mode to troubleshoot without generating code
- Clean up unused files with Knip
- Use .bolt/ignore to exclude files from context
- Split large projects into smaller chunks
- Reset chat history when needed

**Reported Token Usage Issues:**
- Users report burning through tokens quickly on debugging
- One user used 20M+ tokens fixing authentication issues
- Some users spent $1,000+ on tokens for bug fixes
- AI rewrites entire files instead of targeted edits, consuming more tokens

---

## 9. Technical Architecture

### System Architecture

**Frontend Layer:**
- React-based UI
- Vite for build tooling
- WebSocket for real-time communication
- Monaco Editor (VS Code editor)

**AI Layer:**
- Anthropic Claude 3.5 Sonnet (primary)
- OpenAI GPT-4 (alternative)
- Custom middleware for code parsing
- Streaming response protocol
- Multi-model routing (experimental)

**Execution Layer:**
- StackBlitz WebContainers
- WebAssembly runtime
- Virtual filesystem
- Network stack emulation
- Process management

**Backend Services:**
- User authentication and sessions
- Token management and billing
- Project storage and retrieval
- Deployment orchestration
- Integration APIs (GitHub, Figma, Supabase)

### Data Flow

1. **Prompt Input**: User enters natural language prompt
2. **AI Processing**: Claude analyzes and generates code structure
3. **Code Generation**: Structured Code Output Format (SCOF)
4. **File Operations**: Middleware creates/updates files
5. **Environment Setup**: WebContainers install dependencies
6. **Execution**: Node.js runs in browser
7. **Live Preview**: Results render in iframe
8. **User Feedback**: Iteration cycle begins

### Security Model

**Sandbox Isolation:**
- Each project runs in isolated WebContainer
- No access to user's filesystem
- Network requests controlled
- Process isolation per project

**Authentication:**
- JWT-based session management
- OAuth providers (Google, GitHub)
- Team-level access controls
- API key management for integrations

**Environment Variables:**
- Secure secret storage
- Not included in exports by default
- Integration with secret managers (AWS Parameter Store, Azure Key Vault, Google Secret Manager)
- CI/CD pipeline validation

### Performance Optimization

**Caching:**
- npm package caching
- Build output caching
- WebContainer state persistence

**Resource Management:**
- Memory limits per project
- CPU throttling for fair usage
- Automatic cleanup of idle projects

---

## 10. Iteration/Editing Capabilities

### AI-Assisted Editing

**Prompt-Based Modifications:**
- "Add authentication to this app"
- "Change the color scheme to dark mode"
- "Fix the bug in the login function"
- "Add a footer with social links"

**Discussion Mode:**
- Debug and troubleshoot without code generation
- Analyze errors and get suggestions
- Understand code structure
- Planning and architecture discussions

### Manual Editing

**Full IDE Capabilities:**
- Direct code editing in Monaco editor
- Multi-cursor support
- Find and replace across files
- Syntax highlighting and validation
- Code folding
- Bracket matching

**File Management:**
- Create new files and folders
- Delete files
- Rename and move files
- Organize project structure

### Hybrid Workflow

**Best Practice:**
1. Use AI for initial generation and major features
2. Manually tweak styling and minor adjustments
3. Use Discussion Mode for debugging
4. Iterate with specific, focused prompts

**Limitations:**
- AI sometimes rewrites entire files instead of targeted changes
- Token consumption increases with each iteration
- Context window can fill up on large projects
- AI may lose track of changes in long chat sessions

### Version Control

**Built-in Features:**
- Project duplication for creating checkpoints
- Chat history preservation
- Undo via new prompts or manual edits

**Limitations:**
- No native git integration in editor
- No branch management
- No commit history within platform
- Workaround: Export and use external git

---

## 11. Preview/Testing Capabilities

### Live Preview

**Real-Time Rendering:**
- Split-screen preview pane
- Updates on every code change
- Hot Module Replacement (HMR)
- No manual refresh needed

**Preview Features:**
- Full browser simulation
- Responsive design testing
- Different viewport sizes
- Mobile device emulation

### Browser DevTools

**Integrated Tools:**
- Console for logs and errors
- Network tab for API monitoring
- Element inspector
- Breakpoint debugging
- Stack trace analysis

### Testing on Physical Devices

**Mobile Apps (Expo):**
- QR code for instant device testing
- Expo Go app for iOS/Android
- Real device testing without deployment
- Hot reload on physical devices

### Automated Testing

**Capabilities:**
- Run test suites in terminal
- Jest, Vitest, and other frameworks supported
- CI/CD integration for automated testing
- Build verification before deployment

### Performance Testing

**Available Tools:**
- Console performance metrics
- Network waterfall analysis
- Lighthouse audits (via export to external tools)

**Limitations:**
- No built-in load testing
- Limited performance profiling
- No A/B testing features
- Manual performance optimization

---

## 12. Unique Selling Points

### Revolutionary Features

**1. Complete Browser-Based Full-Stack Development**
- First platform to run complete Node.js environments in browser
- No installation, setup, or configuration
- True "zero to app" experience

**2. AI with Complete Environment Control**
- AI manages entire application lifecycle
- Controls filesystem, server, packages, terminal, and browser
- Not just code suggestions—complete application generation

**3. Natural Language to Production**
- Describe app in plain English
- Generate complete, deployable application
- One-click deployment to production
- Hours instead of weeks

**4. Hybrid AI + Manual Development**
- Best of both worlds: AI speed + human precision
- Full IDE for manual tweaking
- Discussion Mode for planning without token waste
- Seamless switching between AI and manual coding

**5. WebContainers Technology**
- Proprietary WebAssembly-based OS in browser
- No cloud dependency for code execution
- Instant boot, no cold starts
- Local compute, no latency

**6. Design-to-Code Workflow**
- Figma integration for pixel-perfect conversion
- AI interprets design intent, not just visual copying
- Supports over 70 programming languages (in broader context)
- 70% reduction in design-to-deployment time

**7. Mobile App Development in Browser**
- Build iOS and Android apps without Xcode or Android Studio
- Test on physical devices via QR code
- Deploy to app stores from browser
- React Native without local setup

### Competitive Advantages

**vs. Cursor AI:**
- bolt.new: Full project generation and deployment
- Cursor: IDE-based code assistance
- bolt.new wins for: Prototyping, non-coders, complete workflows
- Cursor wins for: Professional development, fine-grained control

**vs. v0 by Vercel:**
- bolt.new: Full-stack with backend support
- v0: Frontend-focused, component generation
- bolt.new wins for: Complete applications, backend logic
- v0 wins for: UI/component perfection, Shadcn integration

**vs. Traditional Development:**
- 85% improvement in collaboration efficiency
- 70% reduction in deployment time
- MVP in hours instead of weeks
- No environment setup or DevOps knowledge required

### Market Position

**Recognition:**
- Fastest growing startup ever (0 to $20M ARR in 2 months)
- 1M+ websites built by March 2025
- 1M+ monthly active users
- ~$40M ARR within 5 months of Figma integration

**Community:**
- bolt.diy open source fork: 12K+ GitHub stars
- Active Discord community
- Growing ecosystem of templates and examples

---

## 13. Known Limitations

### Production Readiness Issues

**Not Suitable for Large-Scale Production:**
- High token consumption for debugging
- Deployment issues with complex features
- Struggles with database interactions
- Real-time updates problematic
- Scaling challenges

**User Reports:**
- Projects that work in bolt.new often fail in production
- Missing files and partial deployments common
- Blank screens after deployment
- Complex features break unexpectedly

### Token and Cost Issues

**Excessive Token Consumption:**
- One user: 20M+ tokens to fix single authentication issue
- Multiple reports of $1,000+ spent on debugging
- AI rewrites entire files instead of targeted edits
- Debugging loops consume tokens rapidly

**Free Tier Limitations:**
- 2.5M tokens/month insufficient for serious projects
- Frequent "project size exceeded" errors
- Daily caps restrict usage patterns

### Context Window Problems

**Project Size Limits:**
- Free: 200K token context window
- Paid: 500K token context window
- Large projects exceed context window quickly
- AI loses context and becomes less accurate

**Symptoms:**
- AI becomes unresponsive
- Fails to follow instructions
- Stops processing code
- Inconsistent behavior

**Workarounds:**
- Use .bolt/ignore to exclude files
- Run Knip to clean unused code
- Split project into multiple smaller projects
- Reset chat history frequently
- Duplicate project to start fresh

### Backend and Database Limitations

**Limited Backend Support:**
- JavaScript/Node.js only
- No Python, PHP, Ruby, etc.
- Complex server logic problematic
- Real-time features unreliable

**Database Integration Issues:**
- Supabase integration improved but still challenging
- JWT token management not native
- Session persistence problems
- Complex queries and migrations difficult
- Database migrations not well supported

### AI Limitations

**Code Generation Quality:**
- Simple apps: Excellent
- Complex apps: Poor and unreliable
- AI struggles with:
  - Complex UI customizations
  - Specific design systems
  - Custom animations
  - Deep architectural patterns
  - State management complexity

**Debugging Capabilities:**
- Discussion Mode helps but limited
- Spots simple syntax issues
- Misreads architectural problems
- Cannot handle complex debugging scenarios
- Infinite loops of failed fixes

**Following Instructions:**
- LLMs struggle with long, detailed instructions
- Context drift in long conversations
- Forgets earlier decisions
- Inconsistent implementation of requirements

### Framework and Technology Limitations

**Supported:**
- JavaScript frameworks only
- Browser-compatible code only
- Node.js backend only

**Not Supported:**
- Python, PHP, Ruby, Go, Rust, etc.
- Native mobile (only React Native via Expo)
- Desktop applications
- Native binaries
- Database-heavy applications
- Microservices architecture

### Performance Issues

**Platform Stability:**
- Frequent errors during development
- Unstable development environment
- Bolt rewrites code from scratch instead of incremental updates
- No differential updates, making debugging harder

**Quality Control:**
- Generated code often has errors
- Wasted tokens on fixing AI-generated bugs
- AI fails to deliver functional products
- Multiple fix iterations required

### Collaboration Limitations

**Team Features:**
- Basic collaboration only
- No advanced git integration
- No native code review tools
- Limited conflict resolution

**Version Control:**
- No branches or proper git workflow
- Duplication as version control is primitive
- No merge capabilities
- Cannot handle complex team workflows

### Comparison with Alternatives

**User Consensus (2025):**
- "Perfect for simple apps or rapid prototyping"
- "Not ready" for complex applications
- "Far from full stack" despite claims
- Works for MVPs, fails for production

**What Users Say:**
- "Lightning fast" for simple tasks
- "Most accurate and reliable AI" for basic apps
- "Struggles with Clerk, Supabase integrations"
- "Can't get specific API calls working"
- Until Q1 2025 was "#1 vibe coding tool"
- After updates "got worse, more expensive, slower"

### Enterprise Limitations

**Missing Features:**
- Limited or no SSO in lower tiers
- Basic audit logging
- Minimal team governance
- No advanced compliance certifications
- Limited enterprise security features

---

## 14. Integration Ecosystem

### Official Integrations

**Figma (Launched March 2025):**
- URL modification: prepend bolt.new to Figma URL
- Import from Figma button on homepage
- Powered by Anima for design conversion
- 70% faster design-to-deployment
- 85% collaboration efficiency improvement
- 95% accuracy for complex applications
- Best practices: Use Auto Layout, avoid complex nesting

**Expo (Launched February 2025):**
- Mobile app development for iOS and Android
- Test on physical devices via Expo Go
- QR code for instant device preview
- EAS Build for production apps
- EAS Submit for app store deployment
- Requires Expo account (free tier available)

**Supabase (Enhanced 2025):**
- One-click database connection
- Full PostgreSQL database access
- Authentication and user management
- Storage and file handling
- Edge Functions
- Realtime subscriptions
- Can connect existing Supabase projects
- Pause/Resume projects from bolt.new
- Share database across multiple apps

**Default for New Projects (as of Sept 30, 2025):**
- New projects use Bolt databases by default
- Pre-Sept 30 projects used Supabase by default
- Cannot convert between Bolt and Supabase databases
- Keep existing projects on their original database

**GitHub:**
- Open any public repo in bolt.new (bolt.new/~/github.com/user/repo)
- Export to GitHub via Chrome extension
- Manual download and push workflow
- Integration for team collaboration

**Netlify:**
- One-click deployment
- Automatic builds
- HTTPS by default
- Custom domain support

**Vercel:**
- Direct deployment from editor
- Serverless function support
- Edge network distribution

**Cloudflare Pages:**
- Deploy to Cloudflare network
- Workers integration potential
- Global CDN

### Database Support

**Supported via Integrations:**
- Supabase (PostgreSQL)
- Bolt managed databases
- Firebase (via API)
- MongoDB (via API)

**Limited Native Support:**
- SQLite (in-browser only)
- IndexedDB for client-side storage

### Authentication Providers

**Via Supabase Integration:**
- Email/password
- Magic links
- Social OAuth (Google, GitHub, etc.)
- Phone authentication

**Limitations:**
- JWT management not native to bolt.new
- Session persistence challenging
- Production auth requires external service

---

## 15. Open Source: bolt.diy

### History

- **Original Project**: oTToDev by Cole Medin
- **Rebranding**: Became bolt.diy as official open source fork
- **Adoption**: Moved to StackBlitz GitHub organization
- **Community**: 12K+ GitHub stars as of 2025

### Key Differences from bolt.new

**Multi-Model Support:**
- OpenAI (GPT-4, GPT-3.5)
- Anthropic (Claude family)
- Ollama (local models)
- OpenRouter
- Google Gemini
- LMStudio
- Mistral
- xAI
- HuggingFace
- DeepSeek
- Groq
- Cohere
- Together AI
- Perplexity
- Moonshot (Kimi)
- Hyperbolic
- GitHub Models
- Amazon Bedrock
- OpenAI-like providers

**Customization Benefits:**
- Choose model per prompt
- Use local models for privacy
- Optimize cost by model selection
- No vendor lock-in

**Usage Benefits:**
- Run locally without limits
- No paywall for basic usage
- No internet dependency (with local models)
- Full control over infrastructure

### bolt.diy Additional Features

- One-click deployment to Vercel, Netlify, GitHub Pages
- Enhanced file editor UX
- Chat file uploads
- Intelligent error handling
- Auto-fix suggestions
- More configuration options

### Community & Ecosystem

**Funding:**
- Bolt 100K Open Source Fund announced 2025
- Supporting web infrastructure projects
- Community-driven development

**Active Development:**
- Regular updates and improvements
- Community contributions
- Plugin ecosystem growing
- Template library expanding

---

## 16. Best Practices & Recommendations

### When to Use bolt.new

**Ideal Scenarios:**
- Rapid prototyping and MVPs
- Learning web development
- Client demos and proof-of-concepts
- Simple full-stack applications
- Landing pages and marketing sites
- Internal tools and dashboards
- Portfolio projects
- Hackathon projects
- Testing ideas quickly

### When NOT to Use bolt.new

**Avoid For:**
- Mission-critical production applications
- Complex enterprise software
- Applications requiring non-JavaScript backends
- Real-time systems with heavy server logic
- Projects with extensive database requirements
- Applications requiring fine-grained performance optimization
- Long-term maintainable codebases with large teams
- Projects with strict compliance requirements

### Recommended Workflow

**For Non-Coders:**
1. Start with bolt.new for rapid prototyping
2. Get basic structure and functionality working
3. Export code when hitting limitations
4. Hire developer to refine and productionize

**For Developers:**
1. Use bolt.new for initial project scaffold
2. Generate boilerplate and basic structure
3. Export to local environment (VS Code, Cursor)
4. Continue development with proper version control
5. Implement complex features manually
6. Use professional deployment pipelines

**For Teams:**
1. Use for collaborative prototyping
2. Share demos with stakeholders
3. Validate ideas before full development
4. Export to team repositories
5. Follow standard development practices for production

### Token Optimization Strategies

1. **Use Discussion Mode**: Debug without generating code
2. **Be Specific**: Detailed prompts reduce iteration
3. **Clean Project**: Use Knip to remove unused code
4. **Use .bolt/ignore**: Exclude unnecessary files from context
5. **Split Projects**: Break large apps into smaller pieces
6. **Reset When Stuck**: Duplicate project and start fresh
7. **Manual Edits**: Make small tweaks manually to save tokens
8. **Review Before Accepting**: Check generated code before applying

### Managing Context Window

**Prevent "Project Too Large" Errors:**
- Monitor project size regularly
- Use .bolt/ignore for dependencies, node_modules, build outputs
- Remove unused imports and dead code
- Split frontend and backend into separate projects
- Keep chat history focused and relevant
- Duplicate project to reset context

### Quality Assurance

**Before Deployment:**
1. Test thoroughly in bolt.new preview
2. Test on multiple browsers
3. Test mobile responsiveness
4. Verify all integrations work
5. Check environment variables are set
6. Review generated code for security issues
7. Export and test locally before production deployment

---

## 17. Market Position & Future Outlook

### Current Market Position (2025)

**Growth Metrics:**
- $20M ARR in first 2 months (fastest growing startup ever)
- ~$40M ARR within 5 months of Figma launch
- 1M+ websites deployed by March 2025
- 1M+ monthly active users

**Market Share:**
- Leading in "no-code to low-code" AI development
- Competes with v0, Cursor, Replit, Lovable
- Differentiated by full-stack in-browser capability

### Competitive Landscape

**Direct Competitors:**
- v0 by Vercel (frontend-focused)
- Cursor AI (IDE-based, professional)
- Replit (cloud-based IDE with AI)
- Lovable.dev (similar to bolt.new)
- GitHub Copilot (code completion)
- Codeium (code assistance)

**Market Position:**
- Best for rapid prototyping
- "Canva for coding" positioning
- Captures non-coder market
- Appeals to founders validating ideas

### Recent Developments (2025)

**Q1 2025:**
- Figma integration launches (March)
- Mobile app development via Expo (February)
- Enterprise features announced
- Teams plan rolled out

**Q2-Q3 2025:**
- Supabase integration improvements
- Bolt managed databases introduced
- bolt.diy officially adopted
- 100K Open Source Fund announced
- Context window improvements
- Performance optimizations

**Evolution:**
- From experimental tool to production platform
- Enterprise features and compliance
- Growing integration ecosystem
- Community and open source commitment

### Challenges Ahead

**Technical:**
- Context window limitations remain
- Token costs still high for complex projects
- Production stability needs improvement
- Complex application support lacking

**Market:**
- Competition intensifying
- User expectations rising
- Balancing ease-of-use with power
- Pricing pressure from open source alternatives

**User Sentiment:**
- Mixed reviews: Great for simple apps, struggles with complex
- Concerns about value proposition as complexity grows
- Token consumption complaints
- Some users report quality degradation in recent updates

### Future Opportunities

**Potential Improvements:**
- Better differential code updates (not full rewrites)
- Enhanced database support
- More language support (Python, Go, etc.)
- Improved debugging capabilities
- Better version control integration
- Lower token consumption
- Larger context windows
- More accurate AI for complex applications

**Market Expansion:**
- Enterprise market penetration
- Educational partnerships
- Agency and freelancer focus
- Vertical-specific templates
- Industry-specific solutions

---

## 18. Sources & References

### Official Sources

1. **bolt.new Official Website**: https://bolt.new
2. **bolt.new Support/Help Center**: https://support.bolt.new
3. **bolt.new Pricing Page**: https://bolt.new/pricing
4. **bolt.new Blog**: https://bolt.new/blog
5. **StackBlitz Blog**: https://blog.stackblitz.com
6. **GitHub Repository**: https://github.com/stackblitz/bolt.new
7. **bolt.diy Open Source**: https://github.com/stackblitz-labs/bolt.diy

### Key Blog Posts & Announcements

- "What can you actually build with Bolt? 10 real use cases" - bolt.new blog
- "Bolt 100K Open Source Fund" - StackBlitz blog
- "Unlock seamless collaboration with Bolt Teams" - bolt.new blog
- "Bolt 🤝 Expo: Get your idea to the app store without writing code" - Expo blog
- "Bolt x Figma - Turn Figma designs into production-ready apps" - Various sources

### Analysis & Reviews

- "Bolt.new Review 2025: Complete Guide to StackBlitz's AI Web Development Tool" - AlgoCademy
- "Bolt.new Review 2025: The Good, Bad, and Surprising Findings for Developers" - Trickle
- "Cursor AI, v0, and Bolt.new: An Honest Comparison" - Medium
- "Best AI Coding Tools (2025): Cursor AI vs. Bolt.New v0" - Instructa
- Product Hunt reviews and discussions
- Hacker News discussions

### Technical Documentation

- "Introduction to Bolt" - bolt.new support
- "Supported technologies" - bolt.new support
- "Maximize token efficiency" - bolt.new support
- "WebContainers at its best" - khriztianmoreno's Blog
- Integration documentation for Figma, Expo, Supabase

### Community & User Feedback

- Trustpilot reviews
- Reddit discussions (r/webdev, r/programming)
- Product Hunt reviews and comments
- Slashdot reviews
- G2 reviews
- Twitter/X discussions (@boltdotnew, @stackblitz)

### Comparison & Market Research

- "12 Best Bolt.new Alternatives in 2025" - Superblocks
- "What is the Best Bolt.new Alternative?" - Bind AI IDE
- "Lovable, Bolt.new, or Replit? Vibe coding Tools Review" - Momen
- "Bolt.new revenue, funding & news" - Sacra
- Various AI tool comparison articles

### User Guides & Tutorials

- "Bolt.new Beginner Guide: Build & Deploy Web Apps in Your Browser" - Skywork AI
- "Mastering Bolt.new Environment Variables" - SideTool
- "Building a SaaS MVP in One Day with Bolt.new" - Software on the Road
- "Bolt AI Troubleshooting Guide" - SideTool
- Community tutorials on YouTube and dev blogs

---

## Conclusion

bolt.new represents a revolutionary approach to web development by combining AI-powered code generation with browser-based execution via WebContainers. Its ability to go from natural language prompt to deployed application in minutes is unmatched in the market. However, it's best understood as a prototyping and MVP tool rather than a professional development platform.

### Key Takeaways

**Strengths:**
- Fastest path from idea to working prototype
- No setup or configuration required
- Excellent for non-technical founders and rapid iteration
- Strong integration ecosystem (Figma, Expo, Supabase)
- Active development and community support

**Weaknesses:**
- Not production-ready for complex applications
- High token costs for debugging and iterations
- Limited to JavaScript ecosystem
- Context window constraints on larger projects
- Quality inconsistency on complex features

**Ideal Users:**
- Founders validating ideas
- Designers prototyping interactions
- Developers scaffolding new projects
- Teams creating demos and proofs-of-concept
- Students learning web development

**Recommended Strategy:**
Use bolt.new for rapid prototyping and initial development, then export and continue in professional tools (VS Code, Cursor, etc.) for production refinement and deployment.

---

**Report Compiled:** October 29, 2025
**Research Duration:** Extensive web search across official sources, user reviews, technical documentation, and community feedback
**Last Updated:** October 2025 information included
