// src/utils/normalizer.js
export const normalizeEvents = (rawData) => {
  let allEvents = [];

  Object.entries(rawData).forEach(([type, submissions]) => {
    if (!submissions) return;

    submissions.forEach(sub => {
      // Create a clean object for each submission
      const cleanData = {
        id: sub.id,
        type: type,
        timestamp: sub.created_at,
        details: {}
      };

      // Extract the actual answers from Jotform's weird numeric keys
      for (const key in sub.answers) {
        const fieldName = sub.answers[key].name || key;
        const answerVal = sub.answers[key].answer;
        if (answerVal) {
            cleanData.details[fieldName] = answerVal;
        }
      }
      allEvents.push(cleanData);
    });
  });

  // Sort everything from oldest to newest to build our timeline
  return allEvents.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
};