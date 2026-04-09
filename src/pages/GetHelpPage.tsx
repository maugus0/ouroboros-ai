import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { HelpCircle, ChevronDown, ExternalLink } from "lucide-react";
import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "What is OuroborosAI?",
    answer:
      "OuroborosAI is an intelligent scholarship discovery and application platform. Our coordinated AI agents search, match, and help you apply for scholarships and graduate programs that fit your profile — reducing weeks of manual research to minutes.",
  },
  {
    question: "How does the scholarship matching work?",
    answer:
      "Once you complete your profile (education, interests, profession, etc.), our AI agents continuously scan thousands of scholarships and programs worldwide. Each opportunity is scored against your profile, so you see the most relevant matches first.",
  },
  {
    question: "Is OuroborosAI free to use?",
    answer:
      "OuroborosAI is currently in early access and free for all users. We may introduce premium features in the future, but the core discovery and matching experience will remain accessible.",
  },
  {
    question: "How do I complete my profile?",
    answer:
      "Head to your Profile page and fill in your gender, email, profession, interest, and a short bio. All five fields are required for your profile to be marked as complete — this helps our agents find the best matches for you.",
  },
  {
    question: "What are Assessments?",
    answer:
      "Assessments are upcoming career and personality evaluations that will help our AI agents understand you better. The results will be factored into scholarship and program matching for even more personalized recommendations.",
  },
  {
    question: "How do I reset my password?",
    answer:
      'You can reset your password from the login screen via "Forgot password?" (limited to once per week), or change it from Settings if you\'re already logged in (limited to once per month). Both options revoke all active sessions for security.',
  },
  {
    question: "What is two-factor authentication (2FA)?",
    answer:
      "2FA adds an extra layer of security. When enabled, each login requires a one-time SMS code in addition to your password. You can toggle this in Settings > Security.",
  },
];

function FaqAccordion({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium transition-colors hover:text-primary sm:text-base"
      >
        {item.question}
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="pb-4 text-sm leading-relaxed text-muted-foreground">{item.answer}</div>
      )}
    </div>
  );
}

export default function GetHelpPage() {
  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Get Help</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Find answers to common questions or reach out to us directly.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base sm:text-lg">Frequently Asked Questions</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {faqs.map((faq, i) => (
                  <FaqAccordion key={i} item={faq} />
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base sm:text-lg">Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Can&apos;t find what you&apos;re looking for? Reach out to us on social media and
                  we&apos;ll get back to you as soon as possible.
                </p>
                <Separator />
                <a
                  href="https://www.linkedin.com/company/ouroboros-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-input p-3 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0A66C2]/10">
                      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-[#0A66C2]">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </div>
                    LinkedIn
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
                <a
                  href="https://www.instagram.com/ouroborosai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-input p-3 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#F58529]/10 via-[#DD2A7B]/10 to-[#8134AF]/10">
                      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-[#E4405F]">
                        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.88 0 1.441 1.441 0 012.88 0z" />
                      </svg>
                    </div>
                    Instagram
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-sm text-muted-foreground">
                  We typically respond within 24 hours. For urgent issues, please DM us on LinkedIn.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
