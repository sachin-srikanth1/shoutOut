'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import TypingAnimation from '@/components/typing-animation';

export default function AboutPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-medium text-foreground">About Us</h1>
          <p className="text-muted-foreground">
            <TypingAnimation text="Learn more about Netch.ai and our mission..." speed={30} />
          </p>
        </div>

        <div className="space-y-8">
          {/* Mission */}
          <div className="bg-card/50 rounded-xl p-6 border border-purple-100">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Our Mission</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                At Netch.ai, we believe that meaningful professional connections are the foundation of career growth and 
                business success. Our mission is to revolutionize how professionals network by leveraging artificial 
                intelligence to create more relevant, authentic, and productive connections.
              </p>
              <p>
                We're building the future of professional networking - one where every connection is intentional, 
                every conversation is valuable, and every relationship has the potential to transform careers and businesses.
              </p>
            </div>
          </div>

          {/* What We Do */}
          <div className="bg-card/50 rounded-xl p-6 border border-purple-100">
            <h2 className="text-2xl font-semibold text-foreground mb-4">What We Do</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Netch.ai is an AI-powered professional networking platform that goes beyond traditional networking tools. 
                We use advanced algorithms to analyze your professional background, interests, and goals to connect you 
                with the most relevant professionals in your industry.
              </p>
              <p>
                Our platform provides personalized recommendations, intelligent matching, and tools to help you build 
                meaningful professional relationships that drive real business outcomes.
              </p>
            </div>
          </div>

          {/* Our Values */}
          <div className="bg-card/50 rounded-xl p-6 border border-purple-100">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-foreground">Authenticity</h3>
                <p className="text-muted-foreground text-sm">
                  We believe in genuine connections based on real professional interests and goals.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-foreground">Innovation</h3>
                <p className="text-muted-foreground text-sm">
                  We continuously push the boundaries of what's possible in professional networking.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-foreground">Privacy</h3>
                <p className="text-muted-foreground text-sm">
                  We prioritize the security and privacy of our users' professional information.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-foreground">Impact</h3>
                <p className="text-muted-foreground text-sm">
                  We measure success by the meaningful connections and opportunities we create.
                </p>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="bg-card/50 rounded-xl p-6 border border-purple-100">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Our Team</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Netch.ai was founded by a team of professionals who experienced firsthand the challenges of building 
                meaningful professional networks. Our diverse team brings together expertise in artificial intelligence, 
                professional networking, and user experience design.
              </p>
              <p>
                We're passionate about creating technology that makes professional networking more accessible, 
                efficient, and valuable for everyone.
              </p>
            </div>
          </div>

          {/* Technology */}
          <div className="bg-card/50 rounded-xl p-6 border border-purple-100">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Our Technology</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We leverage cutting-edge artificial intelligence and machine learning algorithms to analyze professional 
                profiles, career trajectories, and networking patterns. Our AI understands the nuances of professional 
                relationships and helps you connect with people who can truly add value to your career.
              </p>
              <p>
                Our platform continuously learns and improves, ensuring that every recommendation becomes more accurate 
                and valuable over time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 