document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chatForm');
    const userInput = document.getElementById('userInput');
    const chatMessages = document.getElementById('chatMessages');
    const newSessionBtn = document.getElementById('newSessionBtn');
    const activityBox = document.getElementById('activityBox');

    
    const emotionActivities = {
        happy: {
            activities: [
                { text: "Share your joy with a friend", image: "https://img.icons8.com/color/48/000000/happy.png" },
                { text: "Write in a gratitude journal", image: "https://img.icons8.com/color/48/000000/notebook.png" },
                { text: "Try a new creative activity", image: "https://img.icons8.com/color/48/000000/paint-palette.png" }
            ],
            responses: [
                "I'm glad to hear you're feeling happy! What's bringing you joy today?",
                "It's wonderful that you're feeling happy! Would you like to share what's making you feel this way?",
                "Happiness is a beautiful feeling! What's contributing to your positive mood?"
            ]
        },
        sad: {
            activities: [
                { text: "Practice self-compassion meditation", image: "https://img.icons8.com/color/48/000000/meditation.png" },
                { text: "Listen to uplifting music", image: "https://img.icons8.com/color/48/000000/music.png" },
                { text: "Take a gentle walk in nature", image: "https://img.icons8.com/color/48/000000/forest.png" }
            ],
            responses: [
                "I'm here to support you through this difficult time. Would you like to talk about what's making you feel sad?",
                "I understand you're feeling sad, and that's completely valid. Would you like to share what's on your mind?",
                "I'm here to listen and support you. What's causing these feelings of sadness?",
                "It's okay to feel sad sometimes. Would you like to talk about what's troubling you?",
                "I hear that you're feeling down. Would you like to share more about what's going on?"
            ]
        },
        anxious: {
            activities: [
                { text: "Try deep breathing exercises", image: "https://img.icons8.com/color/48/000000/breathing.png" },
                { text: "Practice grounding techniques", image: "https://img.icons8.com/color/48/000000/earth-element.png" },
                { text: "Write down your worries", image: "https://img.icons8.com/color/48/000000/writing.png" }
            ],
            responses: [
                "I understand you're feeling anxious. Would you like to talk about what's causing these feelings?",
                "Anxiety can be really challenging. What's on your mind right now?",
                "I'm here to help you through these anxious feelings. Would you like to discuss what's triggering them?",
                "It's okay to feel anxious. Would you like to explore what's making you feel this way?",
                "I hear that you're feeling anxious. Would you like to talk about what's worrying you?"
            ]
        },
        tired: {
            activities: [
                { text: "Take a power nap", image: "https://img.icons8.com/color/48/000000/sleep.png" },
                { text: "Do some gentle stretching", image: "https://img.icons8.com/color/48/000000/stretching.png" },
                { text: "Drink some herbal tea", image: "https://img.icons8.com/color/48/000000/tea.png" }
            ],
            responses: [
                "I hear you're feeling tired. Would you like to talk about what's draining your energy?",
                "Fatigue can affect our mental well-being. What's been tiring you out?",
                "I understand you're feeling exhausted. Would you like to discuss what might be causing this?",
                "It sounds like you're feeling worn out. Would you like to talk about what's been draining you?",
                "I notice you're feeling tired. Would you like to share what's been taking up your energy?"
            ]
        },
        angry: {
            activities: [
                { text: "Try progressive muscle relaxation", image: "https://img.icons8.com/color/48/000000/muscle.png" },
                { text: "Write down your feelings", image: "https://img.icons8.com/color/48/000000/writing.png" },
                { text: "Take a mindful walk", image: "https://img.icons8.com/color/48/000000/walking.png" }
            ],
            responses: [
                "I hear that you're feeling angry. Would you like to talk about what's upsetting you?",
                "Anger is a valid emotion. Would you like to share what's triggering these feelings?",
                "I understand you're feeling angry. Would you like to discuss what's causing this?",
                "It's okay to feel angry. Would you like to talk about what's making you feel this way?",
                "I notice you're feeling angry. Would you like to share what's bothering you?"
            ]
        },
        confused: {
            activities: [
                { text: "Try journaling your thoughts", image: "https://img.icons8.com/color/48/000000/notebook.png" },
                { text: "Practice mindfulness meditation", image: "https://img.icons8.com/color/48/000000/meditation.png" },
                { text: "Make a list of your questions", image: "https://img.icons8.com/color/48/000000/task.png" }
            ],
            responses: [
                "I hear that you're feeling confused. Would you like to talk about what's unclear to you?",
                "It's okay to feel confused sometimes. Would you like to explore what's puzzling you?",
                "I understand you're feeling uncertain. Would you like to discuss what's causing this confusion?",
                "Confusion can be challenging. Would you like to talk about what's making you feel this way?",
                "I notice you're feeling confused. Would you like to share what's on your mind?"
            ]
        }
    };

    // Add conversation context tracking
    let conversationContext = {
        hasExpressedEmotion: false,
        lastEmotion: null,
        hasSharedReason: false,
        waitingForActivityResponse: false,
        waitingForFinalResponse: false
    };

    // Function to get appropriate response based on emotion
    function getEmotionResponse(emotion) {
        if (emotion === 'affirmative') {
            return getRandomResponse([
                "I'm here to listen. How are you feeling right now?",
                "I'm ready to hear about your feelings. What's on your mind?",
                "I'm here to support you. What emotions are you experiencing?",
                "I'm listening. What feelings would you like to share?",
                "I'm here for you. What's been on your mind lately?"
            ]);
        }
        return getRandomResponse(emotionActivities[emotion].responses);
    }

    // Function to get activity response based on emotion and activity
    function getActivityResponse(emotion, activity) {
        const activityResponses = {
            happy: {
                "Share your joy with a friend": [
                    "Sharing happiness with others can multiply your joy! Would you like to talk about how you can share this positive energy?",
                    "Connecting with others when you're happy can strengthen your relationships. Would you like to discuss ways to share your happiness?",
                    "Spreading joy can make your happiness even more meaningful. Would you like to explore ways to share your positive feelings?"
                ],
                "Write in a gratitude journal": [
                    "Writing about what makes you happy can help you appreciate these moments even more. Would you like to start a gratitude practice?",
                    "Keeping track of happy moments can help you maintain this positive energy. Would you like to learn some gratitude journaling techniques?",
                    "Documenting your joy can help you revisit these happy moments later. Would you like to explore some gratitude journaling ideas?"
                ],
                "Try a new creative activity": [
                    "Channeling your happiness into creativity can be very rewarding. Would you like to explore some creative activities?",
                    "Creative expression can help you share and amplify your joy. Would you like to discuss some creative outlets?",
                    "Using your positive energy for creativity can be very fulfilling. Would you like to explore some artistic activities?"
                ]
            },
            sad: {
                "Practice self-compassion meditation": [
                    "Self-compassion meditation can help you be kinder to yourself during difficult times. Would you like to try a guided meditation?",
                    "Being gentle with yourself is important when you're feeling down. Would you like to learn some self-compassion techniques?",
                    "Meditation can help you process your sadness with kindness. Would you like to explore some mindfulness practices?"
                ],
                "Listen to uplifting music": [
                    "Music can be a powerful tool to lift your mood. Would you like some suggestions for uplifting playlists?",
                    "The right music can help shift your emotional state. Would you like to explore some mood-boosting music?",
                    "Music can help you process and move through sadness. Would you like to discuss some therapeutic music options?"
                ],
                "Take a gentle walk in nature": [
                    "Nature can have a calming and uplifting effect. Would you like to discuss some mindful walking techniques?",
                    "Being in nature can help you process your emotions. Would you like to explore some nature-based activities?",
                    "A gentle walk can help you clear your mind and lift your spirits. Would you like to learn some mindful walking practices?"
                ]
            },
            anxious: {
                "Try deep breathing exercises": [
                    "Deep breathing can help calm your nervous system. Would you like to learn some breathing techniques?",
                    "Controlled breathing can help reduce anxiety. Would you like to try some calming exercises?",
                    "Breathing exercises can help you feel more grounded. Would you like to explore some relaxation techniques?"
                ],
                "Practice grounding techniques": [
                    "Grounding can help you feel more present and less anxious. Would you like to learn some grounding exercises?",
                    "Staying present can help reduce anxiety. Would you like to explore some mindfulness techniques?",
                    "Grounding techniques can help you feel more secure. Would you like to try some calming exercises?"
                ],
                "Write down your worries": [
                    "Writing can help you process and organize your thoughts. Would you like to try some journaling techniques?",
                    "Putting worries on paper can help reduce their intensity. Would you like to explore some writing exercises?",
                    "Journaling can help you gain perspective on your concerns. Would you like to learn some therapeutic writing techniques?"
                ]
            },
            tired: {
                "Take a power nap": [
                    "A short nap can help restore your energy. Would you like to learn some tips for effective power napping?",
                    "Rest can help you recharge. Would you like to explore some relaxation techniques?",
                    "A brief nap can help improve your alertness. Would you like to discuss some rest strategies?"
                ],
                "Do some gentle stretching": [
                    "Gentle movement can help increase your energy. Would you like to learn some simple stretches?",
                    "Stretching can help relieve tension and boost energy. Would you like to try some energizing movements?",
                    "Light exercise can help combat fatigue. Would you like to explore some gentle stretching exercises?"
                ],
                "Drink some herbal tea": [
                    "Certain teas can help boost energy naturally. Would you like to learn about energizing herbal teas?",
                    "Herbal tea can be a gentle way to increase alertness. Would you like to explore some energizing tea options?",
                    "Natural remedies can help restore energy. Would you like to discuss some herbal tea suggestions?"
                ]
            },
            angry: {
                "Try progressive muscle relaxation": [
                    "Progressive relaxation can help release tension. Would you like to learn some relaxation techniques?",
                    "Muscle relaxation can help calm strong emotions. Would you like to try some calming exercises?",
                    "Relaxation techniques can help process anger. Would you like to explore some stress-relief methods?"
                ],
                "Write down your feelings": [
                    "Writing can help you process anger constructively. Would you like to try some therapeutic writing exercises?",
                    "Expressing feelings on paper can help release them. Would you like to explore some journaling techniques?",
                    "Writing can help you understand and manage anger. Would you like to learn some emotional processing techniques?"
                ],
                "Take a mindful walk": [
                    "Walking can help process and release anger. Would you like to learn some mindful walking techniques?",
                    "Movement can help channel strong emotions. Would you like to explore some walking meditation practices?",
                    "A mindful walk can help calm intense feelings. Would you like to try some grounding exercises?"
                ]
            },
            confused: {
                "Try journaling your thoughts": [
                    "Writing can help organize and clarify your thoughts. Would you like to try some journaling techniques?",
                    "Journaling can help you make sense of confusion. Would you like to explore some writing exercises?",
                    "Writing can help you gain clarity. Would you like to learn some therapeutic journaling methods?"
                ],
                "Practice mindfulness meditation": [
                    "Mindfulness can help you stay present with uncertainty. Would you like to learn some meditation techniques?",
                    "Meditation can help you find clarity. Would you like to explore some mindfulness practices?",
                    "Mindfulness can help you process confusion. Would you like to try some calming exercises?"
                ],
                "Make a list of your questions": [
                    "Organizing your questions can help find clarity. Would you like to try some structured questioning techniques?",
                    "Listing questions can help identify what you need to know. Would you like to explore some questioning methods?",
                    "Writing down questions can help you find direction. Would you like to learn some problem-solving techniques?"
                ]
            }
        };
        return getRandomResponse(activityResponses[emotion][activity] || activityResponses.sad[activity]);
    }

    // Function to show activity suggestions
    function showActivitySuggestions(emotion) {
        activityBox.innerHTML = '<h3>Suggested Activities</h3>';
        activityBox.style.display = 'block';
        
        const activities = emotionActivities[emotion]?.activities || [];
        activities.forEach(activity => {
            const activityElement = document.createElement('div');
            activityElement.className = 'activity-suggestion';
            activityElement.innerHTML = `
                <img src="${activity.image}" alt="${activity.text}">
                <p>${activity.text}</p>
            `;
            // Add click handler for activity
            activityElement.addEventListener('click', () => {
                addMessage(getActivityResponse(emotion, activity.text), false);
            });
            activityBox.appendChild(activityElement);
        });
    }

    // Function to detect emotion from message
    function detectEmotion(message) {
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes('happy') || lowerMessage.includes('joy') || lowerMessage.includes('great') || 
            lowerMessage.includes('good') || lowerMessage.includes('wonderful') || lowerMessage.includes('excited')) {
            return 'happy';
        } else if (lowerMessage.includes('sad') || lowerMessage.includes('down') || lowerMessage.includes('unhappy') || 
                   lowerMessage.includes('depressed') || lowerMessage.includes('low') || lowerMessage.includes('miserable')) {
            return 'sad';
        } else if (lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('stressed') || 
                   lowerMessage.includes('nervous') || lowerMessage.includes('overwhelmed') || lowerMessage.includes('panicked')) {
            return 'anxious';
        } else if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted') || lowerMessage.includes('drained') || 
                   lowerMessage.includes('fatigued') || lowerMessage.includes('sleepy') || lowerMessage.includes('worn out')) {
            return 'tired';
        } else if (lowerMessage.includes('angry') || lowerMessage.includes('mad') || lowerMessage.includes('furious') || 
                   lowerMessage.includes('frustrated') || lowerMessage.includes('annoyed') || lowerMessage.includes('irritated')) {
            return 'angry';
        } else if (lowerMessage.includes('confused') || lowerMessage.includes('uncertain') || lowerMessage.includes('puzzled') || 
                   lowerMessage.includes('unsure') || lowerMessage.includes('lost') || lowerMessage.includes('mixed up')) {
            return 'confused';
        } else if (lowerMessage === 'yes' || lowerMessage === 'yeah' || lowerMessage === 'sure' || 
                   lowerMessage === 'okay' || lowerMessage === 'ok' || lowerMessage === 'yep') {
            return 'affirmative';
        } else if (lowerMessage === 'no' || lowerMessage === 'nope' || lowerMessage === 'nah' || 
                   lowerMessage === 'not really' || lowerMessage === 'no thanks') {
            return 'negative';
        }
        return null;
    }

    // Function to detect activity from message
    function detectActivity(message) {
        const lowerMessage = message.toLowerCase();
        const activityKeywords = {
            "drink herbal tea": ["tea", "herbal tea", "drink tea", "have tea"],
            "take a power nap": ["nap", "sleep", "rest", "power nap"],
            "do some gentle stretching": ["stretch", "stretching", "exercise", "move"],
            "practice self-compassion meditation": ["meditate", "meditation", "self-compassion"],
            "listen to uplifting music": ["music", "listen", "song", "playlist"],
            "take a gentle walk in nature": ["walk", "nature", "outside", "hike"],
            "try deep breathing exercises": ["breathe", "breathing", "deep breath"],
            "practice grounding techniques": ["ground", "grounding", "present", "mindful"],
            "write down your worries": ["write", "journal", "diary", "note"],
            "try progressive muscle relaxation": ["relax", "muscle", "progressive"],
            "write down your feelings": ["write", "journal", "express", "feelings"],
            "take a mindful walk": ["walk", "mindful", "meditate", "stroll"],
            "try journaling your thoughts": ["journal", "write", "thoughts", "diary"],
            "practice mindfulness meditation": ["meditate", "mindful", "present"],
            "make a list of your questions": ["list", "questions", "write", "organize"],
            "share your joy with a friend": ["share", "friend", "talk", "connect"],
            "write in a gratitude journal": ["gratitude", "journal", "thankful", "appreciate"],
            "try a new creative activity": ["creative", "art", "create", "make"]
        };

        for (const [activity, keywords] of Object.entries(activityKeywords)) {
            if (keywords.some(keyword => lowerMessage.includes(keyword))) {
                return activity;
            }
        }
        return null;
    }

    // Function to get random response from array
    function getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Function to get follow-up response based on emotion
    function getFollowUpResponse(emotion) {
        const followUpResponses = {
            happy: [
                "That sounds wonderful! Would you like to try some activities to maintain this positive energy?",
                "I'm glad to hear that! Would you like to explore some activities to keep this good feeling going?",
                "That's great to hear! Would you like to try some activities to share this happiness?"
            ],
            sad: [
                "I understand this is difficult for you. Would you like to try some activities to help you feel better?",
                "That must be really hard. Would you like to explore some activities to lift your mood?",
                "I hear you. Would you like to try some activities to help you through this?"
            ],
            anxious: [
                "I understand this is causing you anxiety. Would you like to try some activities to help you feel more calm?",
                "That sounds stressful. Would you like to explore some activities to reduce your anxiety?",
                "I hear your concerns. Would you like to try some activities to help you relax?"
            ],
            tired: [
                "I understand you're feeling drained. Would you like to try some activities to help you recharge?",
                "That sounds exhausting. Would you like to explore some activities to boost your energy?",
                "I hear you're feeling worn out. Would you like to try some activities to help you feel more rested?"
            ],
            angry: [
                "I understand you're feeling upset. Would you like to try some activities to help you process these feelings?",
                "That sounds frustrating. Would you like to explore some activities to help you calm down?",
                "I hear your anger. Would you like to try some activities to help you express these feelings in a healthy way?"
            ],
            confused: [
                "I understand you're feeling uncertain. Would you like to try some activities to help you gain clarity?",
                "That sounds confusing. Would you like to explore some activities to help you make sense of things?",
                "I hear you're feeling puzzled. Would you like to try some activities to help you find direction?"
            ]
        };
        return getRandomResponse(followUpResponses[emotion] || followUpResponses.sad);
    }

    // Function to get coping methods response
    function getCopingMethodsResponse(emotion) {
        const copingMethods = {
            happy: [
                "Would you like to explore ways to maintain this positive energy?",
                "Would you like to discuss how to sustain these good feelings?",
                "Would you like to talk about ways to share this happiness with others?"
            ],
            sad: [
                "Would you like to explore some coping strategies to help you feel better?",
                "Would you like to discuss some ways to work through these feelings?",
                "Would you like to talk about some activities that might help lift your mood?"
            ],
            anxious: [
                "Would you like to learn some techniques to help manage your anxiety?",
                "Would you like to explore some calming strategies?",
                "Would you like to discuss some ways to reduce your stress?"
            ],
            tired: [
                "Would you like to explore some ways to boost your energy?",
                "Would you like to discuss some strategies to feel more rested?",
                "Would you like to talk about some activities that might help you recharge?"
            ],
            angry: [
                "Would you like to learn some healthy ways to process your anger?",
                "Would you like to explore some calming techniques?",
                "Would you like to discuss some strategies to manage these feelings?"
            ],
            confused: [
                "Would you like to explore some ways to gain clarity?",
                "Would you like to discuss some strategies to make sense of things?",
                "Would you like to talk about some ways to find direction?"
            ]
        };
        return getRandomResponse(copingMethods[emotion] || copingMethods.sad);
    }

    // Function to get final assistance response
    function getFinalAssistanceResponse(emotion) {
        const finalResponses = {
            happy: [
                "Is there anything else I can help you with today?",
                "Would you like to talk about anything else?",
                "Is there anything more you'd like to discuss?"
            ],
            sad: [
                "Is there anything else I can help you with today?",
                "Would you like to talk about anything else?",
                "Is there anything more you'd like to discuss?"
            ],
            anxious: [
                "Is there anything else I can help you with today?",
                "Would you like to talk about anything else?",
                "Is there anything more you'd like to discuss?"
            ],
            tired: [
                "Is there anything else I can help you with today?",
                "Would you like to talk about anything else?",
                "Is there anything more you'd like to discuss?"
            ],
            angry: [
                "Is there anything else I can help you with today?",
                "Would you like to talk about anything else?",
                "Is there anything more you'd like to discuss?"
            ],
            confused: [
                "Is there anything else I can help you with today?",
                "Would you like to talk about anything else?",
                "Is there anything more you'd like to discuss?"
            ]
        };
        return getRandomResponse(finalResponses[emotion] || finalResponses.sad);
    }

    // Function to get ending response
    function getEndingResponse(emotion) {
        const endingResponses = {
            happy: [
                "I'm glad I could help! Remember, I'm here whenever you need support. Take care!",
                "It was great talking with you! Feel free to come back anytime you need support. Take care!",
                "I'm happy I could help! Don't hesitate to reach out if you need anything else. Take care!"
            ],
            sad: [
                "I'm here for you whenever you need support. Take care of yourself!",
                "Remember, it's okay to feel this way. I'm here whenever you need to talk. Take care!",
                "I'm glad we could talk. Don't hesitate to reach out if you need support. Take care!"
            ],
            anxious: [
                "I'm here whenever you need support. Take care and remember to breathe!",
                "Remember, you're not alone. I'm here whenever you need to talk. Take care!",
                "I'm glad we could talk. Don't hesitate to reach out if you need support. Take care!"
            ],
            tired: [
                "I'm here whenever you need support. Get some rest and take care!",
                "Remember to take care of yourself. I'm here whenever you need to talk. Take care!",
                "I'm glad we could talk. Don't hesitate to reach out if you need support. Take care!"
            ],
            angry: [
                "I'm here whenever you need support. Take care and remember to breathe!",
                "Remember, it's okay to feel this way. I'm here whenever you need to talk. Take care!",
                "I'm glad we could talk. Don't hesitate to reach out if you need support. Take care!"
            ],
            confused: [
                "I'm here whenever you need support. Take care and remember to be patient with yourself!",
                "Remember, it's okay to feel uncertain. I'm here whenever you need to talk. Take care!",
                "I'm glad we could talk. Don't hesitate to reach out if you need support. Take care!"
            ]
        };
        return getRandomResponse(endingResponses[emotion] || endingResponses.sad);
    }

    // Function to get direct activity response
    function getDirectActivityResponse(emotion, activity) {
        const directResponses = {
            "drink herbal tea": {
                happy: "That's a great choice! Herbal tea can help maintain your positive energy. Would you like some suggestions for energizing herbal teas?",
                sad: "A warm cup of herbal tea can be very comforting. Would you like to learn about some mood-lifting tea blends?",
                anxious: "Herbal tea can be very calming. Would you like to know about some anxiety-reducing tea options?",
                tired: "Herbal tea can help boost your energy naturally. Would you like to learn about some energizing tea blends?",
                angry: "A calming cup of tea can help soothe strong emotions. Would you like to know about some relaxing tea options?",
                confused: "Tea can help create a moment of clarity. Would you like to learn about some focus-enhancing tea blends?"
            },
            "take a power nap": {
                happy: "A short nap can help maintain your positive energy. Would you like some tips for an effective power nap?",
                sad: "Rest can help you process your emotions. Would you like to learn some relaxation techniques?",
                anxious: "A brief nap can help reset your nervous system. Would you like some tips for calming rest?",
                tired: "A power nap can be very rejuvenating. Would you like to learn some effective napping techniques?",
                angry: "Rest can help calm strong emotions. Would you like some tips for relaxing effectively?",
                confused: "A short rest can help clear your mind. Would you like to learn some relaxation techniques?"
            },
            "do some gentle stretching": {
                happy: "Movement can help maintain your positive energy. Would you like to learn some energizing stretches?",
                sad: "Gentle movement can help lift your mood. Would you like to try some simple stretches?",
                anxious: "Stretching can help release tension. Would you like to learn some calming movements?",
                tired: "Gentle stretching can help boost your energy. Would you like to try some simple exercises?",
                angry: "Movement can help process strong emotions. Would you like to learn some tension-releasing stretches?",
                confused: "Gentle movement can help clear your mind. Would you like to try some simple stretches?"
            }
        };

        return directResponses[activity]?.[emotion] || 
               "That's a great choice! Would you like to learn more about how to make the most of this activity?";
    }

    // Function to get detailed activity information
    function getActivityDetails(activity) {
        const activityDetails = {
            "drink herbal tea": {
                suggestions: [
                    "Try chamomile tea for relaxation and better sleep",
                    "Peppermint tea can help with digestion and energy",
                    "Lemon balm tea is great for reducing anxiety",
                    "Ginger tea can help with nausea and digestion",
                    "Green tea contains antioxidants and can boost focus"
                ],
                tips: [
                    "Use fresh, filtered water for the best taste",
                    "Let the tea steep for 3-5 minutes for optimal flavor",
                    "Try adding honey or lemon for extra benefits",
                    "Create a calming ritual around your tea time",
                    "Experiment with different temperatures and steeping times"
                ]
            },
            "take a power nap": {
                suggestions: [
                    "Keep naps between 10-20 minutes for optimal energy",
                    "Find a quiet, comfortable place to rest",
                    "Use an eye mask or earplugs if needed",
                    "Set an alarm to avoid oversleeping",
                    "Try napping in the early afternoon for best results"
                ],
                tips: [
                    "Avoid napping too close to bedtime",
                    "Create a consistent napping routine",
                    "Practice deep breathing before napping",
                    "Keep the room slightly cool for better sleep",
                    "Stretch gently after waking up"
                ]
            },
            "do some gentle stretching": {
                suggestions: [
                    "Start with neck and shoulder rolls",
                    "Try gentle spinal twists",
                    "Practice deep breathing while stretching",
                    "Focus on major muscle groups",
                    "Hold each stretch for 15-30 seconds"
                ],
                tips: [
                    "Warm up with light movement first",
                    "Listen to your body and don't push too hard",
                    "Breathe deeply and evenly during stretches",
                    "Stay hydrated before and after stretching",
                    "Make stretching a daily habit"
                ]
            }
        };

        const details = activityDetails[activity];
        if (!details) return null;

        const suggestion = getRandomResponse(details.suggestions);
        const tip = getRandomResponse(details.tips);

        return {
            suggestion,
            tip,
            followUp: "Would you like to try this suggestion now, or would you like to learn more tips?"
        };
    }

    // Function to add message to chat
    function addMessage(text, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
        
        // Add emotion detection for user messages
        if (isUser) {
            const emotion = detectEmotion(text);
            const activity = detectActivity(text);
            
            if (activity) {
                // User mentioned a specific activity
                const details = getActivityDetails(activity);
                if (details) {
                    setTimeout(() => {
                        addMessage(`${details.suggestion}\n\nTip: ${details.tip}\n\n${details.followUp}`, false);
                    }, 500);
                } else {
                    setTimeout(() => {
                        addMessage(getDirectActivityResponse(conversationContext.lastEmotion || 'sad', activity), false);
                    }, 500);
                }
            } else if (emotion) {
                if (emotion === 'affirmative') {
                    if (conversationContext.waitingForActivityResponse) {
                        // User agreed to try activities
                        conversationContext.waitingForActivityResponse = false;
                        showActivitySuggestions(conversationContext.lastEmotion);
                        setTimeout(() => {
                            addMessage(getCopingMethodsResponse(conversationContext.lastEmotion), false);
                        }, 1000);
                    } else if (conversationContext.waitingForFinalResponse) {
                        // User wants more assistance
                        conversationContext.waitingForFinalResponse = false;
                        conversationContext.hasExpressedEmotion = false;
                        setTimeout(() => {
                            addMessage("How are you feeling now?", false);
                        }, 500);
                    } else {
                        conversationContext.hasExpressedEmotion = false;
                        setTimeout(() => {
                            addMessage(getEmotionResponse(emotion), false);
                        }, 500);
                    }
                } else if (emotion === 'negative') {
                    if (conversationContext.waitingForFinalResponse) {
                        // User doesn't want more assistance
                        conversationContext.waitingForFinalResponse = false;
                        setTimeout(() => {
                            addMessage(getEndingResponse(conversationContext.lastEmotion), false);
                        }, 500);
                    }
                } else {
                    conversationContext.hasExpressedEmotion = true;
                    conversationContext.lastEmotion = emotion;
                    conversationContext.hasSharedReason = false;
                    setTimeout(() => {
                        addMessage(getEmotionResponse(emotion), false);
                    }, 500);
                }
            } else if (conversationContext.hasExpressedEmotion && !conversationContext.hasSharedReason) {
                // User is likely sharing the reason for their emotion
                conversationContext.hasSharedReason = true;
                conversationContext.waitingForActivityResponse = true;
                setTimeout(() => {
                    addMessage(getFollowUpResponse(conversationContext.lastEmotion), false);
                }, 500);
            } else if (!conversationContext.hasExpressedEmotion) {
                // If no emotion detected and user hasn't expressed emotion yet
                setTimeout(() => {
                    addMessage("I notice you haven't mentioned how you're feeling. Would you like to share your emotions?", false);
                }, 500);
            }
        }
        
        messageDiv.innerHTML = `<div class="message-content"><p>${text}</p></div>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Handle chat form submission
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = userInput.value.trim();
        
        if (!message) return;
        
        // Add user message to chat
        addMessage(message, true);
        userInput.value = '';
    });

    // Handle new session button click
    newSessionBtn.addEventListener('click', () => {
        chatMessages.innerHTML = '';
        activityBox.style.display = 'none';
        conversationContext = {
            hasExpressedEmotion: false,
            lastEmotion: null,
            hasSharedReason: false,
            waitingForActivityResponse: false,
            waitingForFinalResponse: false
        };
        newSessionBtn.classList.add('rotating');
        setTimeout(() => {
            newSessionBtn.classList.remove('rotating');
        }, 1000);
    });

    // Initial welcome message
    if (chatMessages.children.length === 0) {
        addMessage('Hello! How are you feeling today?', false);
    }
}); 