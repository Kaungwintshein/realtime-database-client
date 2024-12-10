import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { database } from "../firebaseConfig";
import { ref, onValue, set } from "firebase/database";

const UserInfo = () => {
  interface User {
    id: number;
    email: string;
  }

  interface TypingStatus {
    email: string;
    isTyping: boolean;
  }

  interface CursorStatus {
    email: string;
    isCursorIn: boolean;
  }

  const [user, setUser] = useState<User | null>(null);
  const [question, setQuestion] = useState("");
  const [details, setDetails] = useState("");
  const [typingQuestionStatus, setTypingQuestionStatus] =
    useState<TypingStatus | null>(null);
  const [typingDetailsStatus, setTypingDetailsStatus] =
    useState<TypingStatus | null>(null);
  const [cursorQuestionStatus, setCursorQuestionStatus] =
    useState<CursorStatus | null>(null);
  const [cursorDetailsStatus, setCursorDetailsStatus] =
    useState<CursorStatus | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");
    if (userData && accessToken) {
      const parsedData = JSON.parse(userData);
      setUser(parsedData);
    } else {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const questionRef = ref(database, "entries/question");
    const detailsRef = ref(database, "entries/details");
    const typingQuestionRef = ref(database, "typing/question");
    const typingDetailsRef = ref(database, "typing/details");
    const cursorQuestionRef = ref(database, "cursor/question");
    const cursorDetailsRef = ref(database, "cursor/details");

    onValue(questionRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setQuestion(data);
        console.log("Question data fetched successfully:", data);
      }
    });

    onValue(detailsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setDetails(data);
        console.log("Details data fetched successfully:", data);
      }
    });

    onValue(typingQuestionRef, (snapshot) => {
      const data = snapshot.val();
      setTypingQuestionStatus(data);
    });

    onValue(typingDetailsRef, (snapshot) => {
      const data = snapshot.val();
      setTypingDetailsStatus(data);
    });

    onValue(cursorQuestionRef, (snapshot) => {
      const data = snapshot.val();
      setCursorQuestionStatus(data);
    });

    onValue(cursorDetailsRef, (snapshot) => {
      const data = snapshot.val();
      setCursorDetailsStatus(data);
    });
  }, []);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuestion(value);
    set(ref(database, "entries/question"), value)
      .then(() => {
        console.log("Question data updated successfully");
      })
      .catch((error) => {
        console.error("Error updating question data:", error);
      });
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDetails(value);
    set(ref(database, "entries/details"), value)
      .then(() => {
        console.log("Details data updated successfully");
      })
      .catch((error) => {
        console.error("Error updating details data:", error);
      });
  };

  const handleQuestionTyping = () => {
    if (user) {
      set(ref(database, "typing/question"), {
        email: user.email,
        isTyping: true,
      });
      setTimeout(() => {
        set(ref(database, "typing/question"), {
          email: user.email,
          isTyping: false,
        });
      }, 1000);
    }
  };

  const handleDetailsTyping = () => {
    if (user) {
      set(ref(database, "typing/details"), {
        email: user.email,
        isTyping: true,
      });
      setTimeout(() => {
        set(ref(database, "typing/details"), {
          email: user.email,
          isTyping: false,
        });
      }, 1000);
    }
  };

  const handleQuestionFocus = () => {
    if (user) {
      set(ref(database, "cursor/question"), {
        email: user.email,
        isCursorIn: true,
      });
    }
  };

  const handleQuestionBlur = () => {
    if (user) {
      set(ref(database, "cursor/question"), {
        email: user.email,
        isCursorIn: false,
      });
    }
  };

  const handleDetailsFocus = () => {
    if (user) {
      set(ref(database, "cursor/details"), {
        email: user.email,
        isCursorIn: true,
      });
    }
  };

  const handleDetailsBlur = () => {
    if (user) {
      set(ref(database, "cursor/details"), {
        email: user.email,
        isCursorIn: false,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newEntry = {
      question,
      details,
    };
    set(ref(database, "entries"), newEntry)
      .then(() => {
        console.log("Entry created successfully");
      })
      .catch((error) => {
        console.error("Error creating entry:", error);
      });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex w-full max-w-4xl bg-white rounded shadow-md">
        <div className="w-1/3 p-6">
          <h2 className="text-2xl font-bold mb-4">User Info</h2>
          <p>
            <strong>ID:</strong> {user.id}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
        <div className="w-2/3 p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Question:</label>
              <input
                type="text"
                value={question}
                onChange={handleQuestionChange}
                onKeyPress={handleQuestionTyping}
                onFocus={handleQuestionFocus}
                onBlur={handleQuestionBlur}
                required
                className="w-full px-3 py-2 border rounded"
              />
              {typingQuestionStatus?.isTyping && (
                <p>{typingQuestionStatus.email} is typing...</p>
              )}
              {cursorQuestionStatus?.isCursorIn && (
                <p>{cursorQuestionStatus.email} has their cursor here...</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Details:</label>
              <textarea
                value={details}
                onChange={handleDetailsChange}
                onKeyPress={handleDetailsTyping}
                onFocus={handleDetailsFocus}
                onBlur={handleDetailsBlur}
                required
                className="w-full px-3 py-2 border rounded"
              />
              {typingDetailsStatus?.isTyping && (
                <p>{typingDetailsStatus.email} is typing...</p>
              )}
              {cursorDetailsStatus?.isCursorIn && (
                <p>{cursorDetailsStatus.email} has their cursor here...</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
