"use client";
import { StarField } from "@/components/star-field";
import {
  ChevronDown,
  Linkedin,
  Users,
  LineChart,
  Clock,
  Lightbulb,
  BotIcon as Robot,
} from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { ChatbotModal } from "@/components/chatbot-modal";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAppKitAccount } from "@reown/appkit/react";

export default function Home() {
  const { address, isConnected } = useAppKitAccount();
  const [isHeadingVisible, setIsHeadingVisible] = useState(false);
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [isServicesVisible, setIsServicesVisible] = useState(false);
  const [isServicesTitleVisible, setIsServicesTitleVisible] = useState(false);
  const [blurAmount, setBlurAmount] = useState(0);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [riddle, setRiddle] = useState<string | null>(null);
  const [riddleID, setRiddleID] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string>("");
  const [loadingRiddle, setLoadingRiddle] = useState(false);
  const [riddleError, setRiddleError] = useState<string | null>(null);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [answerStatus, setAnswerStatus] = useState<string | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [initialHeight, setInitialHeight] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const aboutSectionRef = useRef<HTMLElement>(null);
  const aboutContentRef = useRef<HTMLDivElement>(null);
  const servicesSectionRef = useRef<HTMLElement>(null);
  const servicesContentRef = useRef<HTMLDivElement>(null);
  const servicesTitleRef = useRef<HTMLHeadingElement>(null);
  const contactSectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef(0);
  const lastScrollRef = useRef(0);
  const ticking = useRef(false);

  // Store initial height on first render
  useEffect(() => {
    if (initialHeight === 0) {
      setInitialHeight(window.innerHeight);
    }
  }, [initialHeight]);

  // Handle scroll events to calculate blur amount
  useEffect(() => {
    const handleScroll = () => {
      // Store the current scroll position
      scrollRef.current = window.scrollY;

      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          // Calculate blur based on scroll position
          // Reduced max blur from 20px to 8px for a more subtle effect
          const maxBlur = 8;
          // Increased trigger height to make the effect develop more slowly
          const triggerHeight = initialHeight * 1.2;
          const newBlurAmount = Math.min(
            maxBlur,
            (scrollRef.current / triggerHeight) * maxBlur
          );

          setBlurAmount(newBlurAmount);

          // Update last scroll position for next comparison
          lastScrollRef.current = scrollRef.current;
          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [initialHeight]);

  // Intersection observer for visibility
  useEffect(() => {
    const headingObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsHeadingVisible(true);
          // Once visible, no need to observe anymore
          if (headingRef.current) {
            headingObserver.unobserve(headingRef.current);
          }
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (headingRef.current) {
      headingObserver.observe(headingRef.current);
    }

    const aboutObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsAboutVisible(true);
          // Once visible, no need to observe anymore
          if (aboutContentRef.current) {
            aboutObserver.unobserve(aboutContentRef.current);
          }
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (aboutContentRef.current) {
      aboutObserver.observe(aboutContentRef.current);
    }

    const servicesObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsServicesVisible(true);
          // Once visible, no need to observe anymore
          if (servicesContentRef.current) {
            servicesObserver.unobserve(servicesContentRef.current);
          }
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (servicesContentRef.current) {
      servicesObserver.observe(servicesContentRef.current);
    }

    const servicesTitleObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsServicesTitleVisible(true);
          // Once visible, no need to observe anymore
          if (servicesTitleRef.current) {
            servicesTitleObserver.unobserve(servicesTitleRef.current);
          }
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (servicesTitleRef.current) {
      servicesTitleObserver.observe(servicesTitleRef.current);
    }

    return () => {
      if (headingRef.current) {
        headingObserver.unobserve(headingRef.current);
      }
      if (aboutContentRef.current) {
        aboutObserver.unobserve(aboutContentRef.current);
      }
      if (servicesContentRef.current) {
        servicesObserver.unobserve(servicesContentRef.current);
      }
      if (servicesTitleRef.current) {
        servicesTitleObserver.unobserve(servicesTitleRef.current);
      }
    };
  }, []);

  // Calculate scale factor based on blur amount
  // Maintain the same scaling effect even with reduced blur
  const scaleFactor = 1 + blurAmount / 16; // Adjusted to maintain similar scaling with reduced blur

  // Add a warp speed effect to stars based on blur amount
  const warpSpeedStyle = {
    transform: `scale(${scaleFactor})`,
    transition: "transform 0.2s ease-out", // Slightly longer transition for smoother effect
  };

  // Scroll to about section
  const scrollToAbout = () => {
    if (aboutSectionRef.current) {
      aboutSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Fetch a riddle paragraph from webhook
  const fetchRiddle = async () => {
    setLoadingRiddle(true);
    setRiddleError(null);
    if (!isConnected) {
      setRiddleError("Please connect your wallet to fetch a riddle.");
      setLoadingRiddle(false);
      return;
    }
    try {
      const res = await fetch(
        "https://abelosaretin.name.ng/webhook-test/getRiddle"
      );

      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }

      const contentType = res.headers.get("content-type") || "";
      let text: string = "";
      let textId: string = "";

      if (contentType.includes("application/json")) {
        const json = await res.json();

        // Expected shape: { data: [ { Riddle_ID: "...", Riddle_Text: "..." } ] }
        if (
          json &&
          typeof json === "object" &&
          Array.isArray(json.data) &&
          json.data.length > 0 &&
          json.data[0].Riddle_Text
        ) {
          textId = json.data[0].Riddle_ID;
          text = String(json.data[0].Riddle_Text);
        } else if (typeof json === "string") {
          text = json;
        } else if (json.text) {
          text = String(json.text);
        } else if (json.paragraph) {
          text = String(json.paragraph);
        } else if (json.message) {
          text = String(json.message);
        } else {
          text = JSON.stringify(json);
        }
      } else {
        text = await res.text();
      }

      setRiddle(text.trim());
      setRiddleID(textId.trim()); // Example of setting riddle ID
    } catch (err: any) {
      console.error("fetchRiddle error:", err);
      setRiddleError(err?.message || "Failed to load riddle");
      setRiddle(null);
    } finally {
      setLoadingRiddle(false);
    }
  };

  // Submit answer handler: POST to webhook with Riddle_ID, Riddle_Text, userAnswer, userWallet
  const submitAnswer = async () => {
    setRiddleError(null);
    setAnswerStatus(null);
    setCorrectAnswer(null);
    if (!answer || !answer.trim()) {
      setRiddleError("Please enter an answer before submitting.");
      return;
    }

    if (!isConnected) {
      setRiddleError(
        "Please connect your wallet before submitting your answer."
      );
      return;
    }

    setSubmittingAnswer(true);

    try {
      const payload = {
        Riddle_ID: riddleID ?? null,
        Riddle_Text: riddle ?? null,
        userAnswer: answer.trim(),
        userWallet: address ?? null,
      };

      const res = await fetch(
        "https://abelosaretin.name.ng/webhook-test/submitRiddle",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        let errText = `Request failed (${res.status})`;
        try {
          const errJson = await res.json();
          if (errJson?.message) errText = String(errJson.message);
        } catch (e) {
          // ignore
        }
        throw new Error(errText);
      }

      // If webhook returns JSON, parse for message
      let successMsg = "Answer submitted successfully.";
      try {
        const data = await res.json();
        console.log("submit response:", data);

        // Response shape example:
        // [ { data: [ { Pass: "...", Status: "Pass", Correct_Answer: "...", ... } ] } ]
        let inner: any = null;

        if (Array.isArray(data) && data.length > 0) {
          // If top-level is array with an object containing `data`
          if (
            data[0] &&
            Array.isArray(data[0].data) &&
            data[0].data.length > 0
          ) {
            inner = data[0].data[0];
          } else if (
            data[0] &&
            typeof data[0] === "object" &&
            (data[0].Pass || data[0].Status)
          ) {
            // maybe the useful object is directly at data[0]
            inner = data[0];
          }
        } else if (data && typeof data === "object") {
          if (Array.isArray(data.data) && data.data.length > 0)
            inner = data.data[0];
          else inner = data;
        }

        const statusVal =
          inner?.Pass ?? inner?.Status ?? inner?.pass ?? inner?.status ?? null;
        const correctVal =
          inner?.Correct_Answer ??
          inner?.CorrectAnswer ??
          inner?.correct_answer ??
          inner?.Correct ??
          null;

        setAnswerStatus(statusVal ? String(statusVal) : null);
        setCorrectAnswer(correctVal ? String(correctVal) : null);
        setAnswer("");
      } catch (e) {
        // no-op
      }
    } catch (err: any) {
      console.error("submitAnswer error:", err);
      setRiddleError(err?.message || "Failed to submit answer");
    } finally {
      setSubmittingAnswer(false);
    }
  };

  // Scroll to contact section
  const scrollToContact = () => {
    if (contactSectionRef.current) {
      contactSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Open chatbot modal
  const openChatbot = () => {
    setIsChatbotOpen(true);
  };

  // Close chatbot modal
  const closeChatbot = () => {
    setIsChatbotOpen(false);
  };

  // Use fixed height for hero section based on initial viewport height
  const heroStyle = {
    height: initialHeight ? `${initialHeight}px` : "100vh",
  };

  return (
    <>
      <div className="min-h-screen">
        <section
          className="relative w-full overflow-hidden bg-black"
          style={heroStyle}
        >
          {/* Navigation links in top right corner */}
          <div className="absolute top-6 right-6 z-10 flex space-x-3">
            <appkit-button />
          </div>
          onClick={fetchRiddle}
          disabled={!isConnected}
          <StarField blurAmount={blurAmount} />
        </section>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-center">
          <div
            className="backdrop-blur-sm px-6 py-4 rounded-lg inline-block relative"
            {...(!isConnected && (
              <p className="mt-2 text-sm text-yellow-300">
                Connect your wallet to enable this button.
              </p>
            ))}
            style={{
              background:
                "radial-gradient(circle, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.3) 100%)",
            }}
          >
            <h1 className="text-4xl font-bold text-white md:text-6xl font-heading">
              AI Riddler
            </h1>
            {/* <p className="mt-4 text-lg text-gray-300 md:text-xl px-4 max-w-xs mx-auto md:max-w-none">
                Fractional AI Product and Technology Expertise
              </p> */}
            <Button
              onClick={fetchRiddle}
              variant="outline"
              size="sm"
              className="mt-6 bg-transparent text-white border-white hover:bg-white hover:text-black transition-colors"
            >
              Get Riddle
            </Button>
            {/* Riddle output area */}
            <div className="mt-4">
              <div aria-live="polite" className="min-h-[2rem]">
                {loadingRiddle && (
                  <p className="mt-4 text-lg text-gray-300 md:text-xl px-4 max-w-xs mx-auto md:max-w-none">
                    Loading riddle...
                  </p>
                )}
                {riddleError && (
                  <p className="mt-4 text-lg text-gray-300 md:text-xl px-4 max-w-xs mx-auto md:max-w-none">
                    {riddleError}
                  </p>
                )}
                {riddle && !loadingRiddle && (
                  <>
                    {/* <p className="mt-4 text-lg text-gray-300 md:text-xl px-4 max-w-xs mx-auto md:max-w-none">
                      {riddleID}
                    </p> */}

                    <p className="mt-4 text-lg text-gray-300 md:text-xl px-4 max-w-xs mx-auto md:max-w-none">
                      {riddle}
                    </p>

                    {/* Answer textbox + submit button */}
                    <div className="mt-4 flex flex-col sm:flex-row items-center gap-2 justify-center">
                      <input
                        type="text"
                        aria-label="Your answer"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Type your answer..."
                        className="w-full sm:w-auto px-3 py-2 rounded-md bg-white/5 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                      />
                      <Button
                        onClick={submitAnswer}
                        disabled={!answer.trim() || submittingAnswer}
                        variant="outline"
                        size="sm"
                        className="mt-0"
                      >
                        {submittingAnswer ? "Submitting..." : "Submit"}
                      </Button>
                    </div>

                    {/* Submission result */}
                    <div className="mt-3 text-center">
                      {answerStatus && (
                        <p
                          className={"mb-2 text-sm font-medium  text-gray-300"}
                        >
                          {answerStatus}
                        </p>
                      )}

                      {correctAnswer && (
                        <p className="text-sm text-gray-300">
                          Correct answer: {correctAnswer}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
