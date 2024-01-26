export let createQuizData = {
  title: "Quiz1",
  creatorId: "default",
  imageKey: "temp/icebreaker-909099.jpeg",
};

export const createQuestionsData = (quizId) => {
  return {
    text: "Question 1",
    displayDuration: 20,
    imageKey: `${quizId}/icebreaker-909099.jpeg`,
    options: [
      {
        text: "Option 1",
        isCorrect: true,
      },

      {
        text: "Option 2",
        isCorrect: false,
      },
    ],
  };
};

export let updateQuizData = {
  title: "Quiz1",
  creatorId: "default",
  imageKey: "temp/icebreaker-909099.jpeg",
};
