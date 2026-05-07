<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Category;
use App\Models\Skill;
use App\Models\Company;
use App\Models\CandidatesProfile;
use App\Models\Job;
use App\Models\Application;
use App\Models\ApplicationQuestion;
use App\Models\ApplicationAnswer;
use App\Models\SavedJob;
use App\Models\ContactRequest;
use App\Models\Notification;
use App\Models\ActivityLog;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ========== USERS ==========
        $users = [
            // Admin users
            [
                'name' => 'Admin User',
                'email' => 'admin@jobboard.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ],
            // Employer users
            [
                'name' => 'Tech Corp HR',
                'email' => 'hr@techcorp.com',
                'password' => Hash::make('password'),
                'role' => 'employer',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Sarah Johnson',
                'email' => 'sarah@designstudio.com',
                'password' => Hash::make('password'),
                'role' => 'employer',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Michael Chen',
                'email' => 'michael@startup.io',
                'password' => Hash::make('password'),
                'role' => 'employer',
                'email_verified_at' => now(),
            ],
            // Candidate users
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'password' => Hash::make('password'),
                'role' => 'candidate',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'password' => Hash::make('password'),
                'role' => 'candidate',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Robert Wilson',
                'email' => 'robert@example.com',
                'password' => Hash::make('password'),
                'role' => 'candidate',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Emily Davis',
                'email' => 'emily@example.com',
                'password' => Hash::make('password'),
                'role' => 'candidate',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'David Brown',
                'email' => 'david@example.com',
                'password' => Hash::make('password'),
                'role' => 'candidate',
                'email_verified_at' => now(),
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }

        // ========== CATEGORIES ==========
        $categories = [
            ['name' => 'Software Development', 'slug' => 'software-development'],
            ['name' => 'Design', 'slug' => 'design'],
            ['name' => 'Marketing', 'slug' => 'marketing'],
            ['name' => 'Sales', 'slug' => 'sales'],
            ['name' => 'Customer Support', 'slug' => 'customer-support'],
            ['name' => 'Human Resources', 'slug' => 'human-resources'],
            ['name' => 'Finance', 'slug' => 'finance'],
            ['name' => 'Project Management', 'slug' => 'project-management'],
            ['name' => 'Data Science', 'slug' => 'data-science'],
            ['name' => 'DevOps', 'slug' => 'devops'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        // ========== SKILLS ==========
        $skills = [
            ['name' => 'PHP'],
            ['name' => 'Laravel'],
            ['name' => 'React'],
            ['name' => 'Vue.js'],
            ['name' => 'JavaScript'],
            ['name' => 'Python'],
            ['name' => 'Node.js'],
            ['name' => 'SQL'],
            ['name' => 'Git'],
            ['name' => 'Docker'],
            ['name' => 'AWS'],
            ['name' => 'Figma'],
            ['name' => 'Adobe XD'],
            ['name' => 'SEO'],
            ['name' => 'Content Writing'],
            ['name' => 'Project Management'],
            ['name' => 'Agile'],
            ['name' => 'Scrum'],
        ];

        foreach ($skills as $skill) {
            Skill::create($skill);
        }

        // ========== COMPANIES ==========
        $employers = User::where('role', 'employer')->get();
        $companiesData = [
            [
                'name' => 'Tech Corp',
                'description' => 'Leading technology company specializing in software solutions.',
                'website' => 'https://techcorp.com',
                'logo' => 'companies/techcorp_logo.png',
                'industry' => 'Information Technology',
                'location' => 'San Francisco, CA',
                'contact_email' => 'hr@techcorp.com',
                'contact_phone' => '+1 (555) 123-4567',
            ],
            [
                'name' => 'Design Studio',
                'description' => 'Creative agency focused on UX/UI design and branding.',
                'website' => 'https://designstudio.com',
                'logo' => 'companies/designstudio_logo.png',
                'industry' => 'Design',
                'location' => 'New York, NY',
                'contact_email' => 'hello@designstudio.com',
                'contact_phone' => '+1 (555) 234-5678',
            ],
            [
                'name' => 'StartUp.io',
                'description' => 'Fast-growing startup building innovative products.',
                'website' => 'https://startup.io',
                'logo' => 'companies/startup_logo.png',
                'industry' => 'Technology',
                'location' => 'Austin, TX',
                'contact_email' => 'careers@startup.io',
                'contact_phone' => '+1 (555) 345-6789',
            ],
        ];

        foreach ($employers as $index => $employer) {
            Company::create(array_merge($companiesData[$index], ['employer_id' => $employer->id]));
        }

        // ========== CANDIDATE PROFILES ==========
        $candidates = User::where('role', 'candidate')->get();
        $profilesData = [
            [
                'headline' => 'Senior Full Stack Developer',
                'bio' => 'Experienced developer with 8+ years in web development.',
                'location' => 'San Francisco, CA',
                'phone' => '+1 (555) 444-1111',
                'resume_file' => 'resumes/john_doe_resume.pdf',
                'portfolio_url' => 'https://johndoe.dev',
                'linkedin_url' => 'https://linkedin.com/in/johndoe',
                'years_of_experience' => 8,
            ],
            [
                'headline' => 'UI/UX Designer',
                'bio' => 'Creative designer passionate about user-centered design.',
                'location' => 'New York, NY',
                'phone' => '+1 (555) 444-2222',
                'resume_file' => 'resumes/jane_smith_resume.pdf',
                'portfolio_url' => 'https://janesmith.design',
                'linkedin_url' => 'https://linkedin.com/in/janesmith',
                'years_of_experience' => 5,
            ],
            [
                'headline' => 'Backend Developer',
                'bio' => 'Specialized in PHP, Laravel, and database optimization.',
                'location' => 'Austin, TX',
                'phone' => '+1 (555) 444-3333',
                'resume_file' => 'resumes/robert_wilson_resume.pdf',
                'portfolio_url' => null,
                'linkedin_url' => 'https://linkedin.com/in/robertwilson',
                'years_of_experience' => 4,
            ],
            [
                'headline' => 'Marketing Specialist',
                'bio' => 'Digital marketing expert with SEO and social media focus.',
                'location' => 'Chicago, IL',
                'phone' => '+1 (555) 444-4444',
                'resume_file' => 'resumes/emily_davis_resume.pdf',
                'portfolio_url' => 'https://emilydavis.marketing',
                'linkedin_url' => 'https://linkedin.com/in/emilydavis',
                'years_of_experience' => 3,
            ],
            [
                'headline' => 'DevOps Engineer',
                'bio' => 'Cloud infrastructure specialist with AWS certification.',
                'location' => 'Seattle, WA',
                'phone' => '+1 (555) 444-5555',
                'resume_file' => 'resumes/david_brown_resume.pdf',
                'portfolio_url' => null,
                'linkedin_url' => 'https://linkedin.com/in/davidbrown',
                'years_of_experience' => 6,
            ],
        ];

        foreach ($candidates as $index => $candidate) {
            CandidatesProfile::create(array_merge($profilesData[$index], ['user_id' => $candidate->id]));
        }

        // ========== JOBS ==========
        $companies = Company::all();
        $categories = Category::all();
        $admin = User::where('role', 'admin')->first();

        $jobsData = [
            [
                'title' => 'Senior Laravel Developer',
                'slug' => 'senior-laravel-developer',
                'description' => 'We are looking for an experienced Laravel developer to join our team.',
                'responsibilities' => 'Develop APIs, optimize database queries, mentor junior developers.',
                'requirements' => '5+ years PHP experience, strong Laravel knowledge, MySQL expertise.',
                'benefits' => 'Health insurance, 401k, remote work options, learning stipend.',
                'location' => 'Remote',
                'work_type' => 'remote',
                'employment_type' => 'full_time',
                'experience_level' => 'senior',
                'salary_min' => 120000,
                'salary_max' => 150000,
                'salary_currency' => 'USD',
                'application_deadline' => now()->addDays(30),
                'status' => 'approved',
                'approved_at' => now(),
            ],
            [
                'title' => 'Frontend React Developer',
                'slug' => 'frontend-react-developer',
                'description' => 'Seeking React expert to build modern web applications.',
                'responsibilities' => 'Build reusable components, optimize performance, collaborate with designers.',
                'requirements' => '3+ years React experience, Redux, TailwindCSS.',
                'benefits' => 'Flexible hours, remote work, annual bonus.',
                'location' => 'New York, NY',
                'work_type' => 'hybrid',
                'employment_type' => 'full_time',
                'experience_level' => 'mid',
                'salary_min' => 90000,
                'salary_max' => 120000,
                'salary_currency' => 'USD',
                'application_deadline' => now()->addDays(20),
                'status' => 'approved',
                'approved_at' => now(),
            ],
            [
                'title' => 'UI/UX Designer',
                'slug' => 'ui-ux-designer',
                'description' => 'Creative designer needed for exciting projects.',
                'responsibilities' => 'Create wireframes, prototypes, user research.',
                'requirements' => 'Figma proficiency, portfolio required, 3+ years experience.',
                'benefits' => 'Creative environment, professional development, health benefits.',
                'location' => 'San Francisco, CA',
                'work_type' => 'on_site',
                'employment_type' => 'full_time',
                'experience_level' => 'mid',
                'salary_min' => 85000,
                'salary_max' => 110000,
                'salary_currency' => 'USD',
                'application_deadline' => now()->addDays(25),
                'status' => 'pending',
                'approved_at' => null,
            ],
            [
                'title' => 'DevOps Engineer',
                'slug' => 'devops-engineer',
                'description' => 'Infrastructure automation expert needed.',
                'responsibilities' => 'Manage AWS infrastructure, CI/CD pipelines, monitoring.',
                'requirements' => 'Docker, Kubernetes, AWS, Terraform experience.',
                'benefits' => 'Competitive salary, stock options, remote work.',
                'location' => 'Remote',
                'work_type' => 'remote',
                'employment_type' => 'full_time',
                'experience_level' => 'senior',
                'salary_min' => 130000,
                'salary_max' => 160000,
                'salary_currency' => 'USD',
                'application_deadline' => now()->addDays(15),
                'status' => 'approved',
                'approved_at' => now(),
            ],
            [
                'title' => 'Digital Marketing Manager',
                'slug' => 'digital-marketing-manager',
                'description' => 'Lead our marketing efforts and grow our brand.',
                'responsibilities' => 'SEO strategy, content marketing, social media management.',
                'requirements' => '5+ years digital marketing, analytics tools, SEO expertise.',
                'benefits' => 'Performance bonus, flexible schedule, training budget.',
                'location' => 'Austin, TX',
                'work_type' => 'hybrid',
                'employment_type' => 'full_time',
                'experience_level' => 'senior',
                'salary_min' => 80000,
                'salary_max' => 100000,
                'salary_currency' => 'USD',
                'application_deadline' => now()->addDays(40),
                'status' => 'pending',
                'approved_at' => null,
            ],
            [
                'title' => 'Junior PHP Developer',
                'slug' => 'junior-php-developer',
                'description' => 'Entry level position for passionate developers.',
                'responsibilities' => 'Write clean code, learn new technologies, team collaboration.',
                'requirements' => 'Basic PHP knowledge, willingness to learn, computer science degree.',
                'benefits' => 'Mentorship program, learning budget, team events.',
                'location' => 'Chicago, IL',
                'work_type' => 'on_site',
                'employment_type' => 'full_time',
                'experience_level' => 'entry',
                'salary_min' => 55000,
                'salary_max' => 70000,
                'salary_currency' => 'USD',
                'application_deadline' => now()->addDays(35),
                'status' => 'approved',
                'approved_at' => now(),
            ],
            [
                'title' => 'Part-time Content Writer',
                'slug' => 'part-time-content-writer',
                'description' => 'Create engaging content for our blog and social media.',
                'responsibilities' => 'Write articles, blog posts, social media content.',
                'requirements' => 'Excellent writing skills, SEO knowledge, portfolio.',
                'benefits' => 'Flexible hours, remote work.',
                'location' => 'Remote',
                'work_type' => 'remote',
                'employment_type' => 'part_time',
                'experience_level' => 'junior',
                'salary_min' => 25,
                'salary_max' => 35,
                'salary_currency' => 'USD',
                'application_deadline' => now()->addDays(10),
                'status' => 'approved',
                'approved_at' => now(),
            ],
        ];

        foreach ($jobsData as $index => $jobData) {
            Job::create(array_merge($jobData, [
                'company_id' => $companies[$index % count($companies)]->id,
                'category_id' => $categories[$index % count($categories)]->id,
                'approved_by' => $jobData['status'] === 'approved' ? $admin->id : null,
            ]));
        }

        // ========== APPLICATIONS ==========
        $jobs = Job::all();
        $candidatesList = User::where('role', 'candidate')->get();

        $applicationsData = [
            ['application_status' => 'pending', 'cover_letter' => 'I am very interested in this position...'],
            ['application_status' => 'shortlisted', 'cover_letter' => 'My skills align perfectly with this role...'],
            ['application_status' => 'accepted', 'cover_letter' => 'Excited about this opportunity...'],
            ['application_status' => 'rejected', 'cover_letter' => 'Thank you for considering my application...'],
            ['application_status' => 'pending', 'cover_letter' => 'I would love to join your team...'],
        ];

        foreach ($jobs as $job) {
            $numApplications = rand(2, 4);
            for ($i = 0; $i < $numApplications; $i++) {
                $candidate = $candidatesList->random();
                $appData = $applicationsData[array_rand($applicationsData)];

                Application::create([
                    'job_id' => $job->id,
                    'candidate_id' => $candidate->id,
                    'resume_file' => 'applications/resume_' . $candidate->id . '.pdf',
                    'cover_letter' => $appData['cover_letter'],
                    'applicant_name' => $candidate->name,
                    'applicant_email' => $candidate->email,
                    'applicant_phone' => $candidate->candidatesProfile?->phone,
                    'application_status' => $appData['application_status'],
                    'employer_notes' => $appData['application_status'] === 'shortlisted' ? 'Good candidate, schedule interview' : null,
                    'reviewed_at' => $appData['application_status'] !== 'pending' ? now() : null,
                ]);
            }
        }

        // ========== APPLICATION QUESTIONS ==========
        $jobsWithQuestions = Job::take(3)->get();
        $questionsData = [
            ['question' => 'What is your experience with Laravel?', 'input_type' => 'textarea', 'is_required' => true],
            ['question' => 'Why do you want to work with us?', 'input_type' => 'textarea', 'is_required' => true],
            ['question' => 'What is your expected salary?', 'input_type' => 'text', 'is_required' => false],
            ['question' => 'How many years of experience do you have?', 'input_type' => 'number', 'is_required' => true],
            ['question' => 'Do you have a portfolio?', 'input_type' => 'url', 'is_required' => false],
        ];

        foreach ($jobsWithQuestions as $job) {
            foreach ($questionsData as $questionData) {
                ApplicationQuestion::create([
                    'job_id' => $job->id,
                    'question' => $questionData['question'],
                    'input_type' => $questionData['input_type'],
                    'is_required' => $questionData['is_required'],
                ]);
            }
        }

        // ========== APPLICATION ANSWERS ==========
        $applications = Application::take(10)->get();
        $questions = ApplicationQuestion::all();

        foreach ($applications as $application) {
            $randomQuestions = $questions->random(3);
            foreach ($randomQuestions as $question) {
                $answer = match ($question->input_type) {
                    'textarea' => 'This is my detailed answer to: ' . $question->question,
                    'number' => rand(1, 10),
                    'url' => 'https://portfolio.example.com',
                    default => 'Sample answer for ' . $question->question,
                };

                ApplicationAnswer::create([
                    'application_id' => $application->id,
                    'job_id' => $application->job_id,  // 👈 Add this line
                    'question_id' => $question->id,
                    'answer' => $answer,
                ]);
            }
        }

        // ========== SAVED JOBS ==========
        foreach ($candidatesList as $candidate) {
            $randomJobs = $jobs->random(rand(2, 4));
            foreach ($randomJobs as $job) {
                SavedJob::create([
                    'candidate_id' => $candidate->id,
                    'job_id' => $job->id,
                ]);
            }
        }

        // ========== CONTACT REQUESTS ==========
        foreach ($candidatesList->take(3) as $candidate) {
            $randomJob = $jobs->random();
            ContactRequest::create([
                'job_id' => $randomJob->id,
                'candidate_id' => $candidate->id,
                'candidate_name' => $candidate->name,
                'candidate_email' => $candidate->email,
                'candidate_phone' => $candidate->candidatesProfile?->phone,
                'message' => 'I am very interested in this position. Please contact me for more details.',
            ]);
        }

        // ========== NOTIFICATIONS ==========
        $allUsers = User::all();
        $notificationsData = [
            ['title' => 'Job Application Received', 'message' => 'A candidate has applied for your job posting.', 'type' => 'application', 'is_read' => false],
            ['title' => 'Application Status Updated', 'message' => 'Your application status has been updated.', 'type' => 'application', 'is_read' => false],
            ['title' => 'Job Approved', 'message' => 'Your job posting has been approved by admin.', 'type' => 'job', 'is_read' => true],
            ['title' => 'New Job Match', 'message' => 'A new job matching your skills has been posted.', 'type' => 'job', 'is_read' => false],
            ['title' => 'Profile View', 'message' => 'An employer viewed your profile.', 'type' => 'profile', 'is_read' => false],
        ];

        foreach ($allUsers as $user) {
            $numNotifications = rand(2, 4);
            for ($i = 0; $i < $numNotifications; $i++) {
                $notifData = $notificationsData[array_rand($notificationsData)];
                Notification::create([
                    'user_id' => $user->id,
                    'title' => $notifData['title'],
                    'message' => $notifData['message'],
                    'type' => $notifData['type'],
                    'is_read' => $notifData['is_read'],
                ]);
            }
        }

        // ========== ACTIVITY LOGS ==========
        $activities = [
            ['action' => 'login', 'description' => 'User logged in'],
            ['action' => 'view_job', 'description' => 'Viewed job details'],
            ['action' => 'apply_job', 'description' => 'Applied for a position'],
            ['action' => 'post_job', 'description' => 'Posted a new job listing'],
            ['action' => 'update_profile', 'description' => 'Updated profile information'],
            ['action' => 'save_job', 'description' => 'Saved a job for later'],
            ['action' => 'contact_employer', 'description' => 'Sent contact request to employer'],
        ];

        foreach ($allUsers as $user) {
            $numActivities = rand(5, 10);
            for ($i = 0; $i < $numActivities; $i++) {
                $activity = $activities[array_rand($activities)];
                ActivityLog::create([
                    'user_id' => $user->id,
                    'action' => $activity['action'],
                    'description' => $activity['description'],
                    'created_at' => now()->subDays(rand(0, 30)), // 👈 Change this line
                ]);
            }
        }
    }
}
