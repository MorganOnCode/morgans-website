export interface PrimaryEmotion {
    name: string
    startColor: string
    endColor: string
    rotation: number
    children: Emotion[]
  }
  
  export interface Emotion {
    name: string
    children: string[]
  }
  
  export const PRIMARY_EMOTIONS: PrimaryEmotion[] = [
    {
      name: "Joy",
      startColor: "#FCE300",
      endColor: "#90C63F",
      rotation: 0,
      children: [
        { name: "Peaceful", children: ["Tranquil", "Serene"] },
        { name: "Content", children: ["Satisfied", "Pleased"] },
        { name: "Happy", children: ["Jovial", "Delighted"] },
        { name: "Cheerful", children: ["Amused", "Playful"] },
        { name: "Proud", children: ["Triumphant", "Illustrious"] },
        { name: "Optimistic", children: ["Eager", "Hopeful"] },
        { name: "Excited", children: ["Enthusiastic", "Zealous"] },
        { name: "Euphoric", children: ["Elated", "Jubilant"] },
      ],
    },
    {
      name: "Love",
      startColor: "#FFD700",
      endColor: "#FFB347",
      rotation: 60,
      children: [
        { name: "Enchanted", children: ["Enthralled", "Rapturous"] },
        { name: "Romantic", children: ["Passionate", "Emanored"] },
        { name: "Affectionate", children: ["Warmhearted", "Compassionate"] },
        { name: "Sentimental", children: ["Tender", "Nostalgic"] },
        { name: "Grateful", children: ["Appreciative", "Thankful"] },
      ],
    },
    {
      name: "Fear",
      startColor: "#FFA500",
      endColor: "#FF4500",
      rotation: 120,
      children: [
        { name: "Scared", children: ["Frightened", "Helpless"] },
        { name: "Terrified", children: ["Panicked", "Hysterical"] },
        { name: "Insecure", children: ["Inferior", "Inadequate"] },
        { name: "Nervous", children: ["Worried", "Anxious"] },
        { name: "Horrified", children: ["Mortified", "Dreadful"] },
      ],
    },
    {
      name: "Anger",
      startColor: "#FF0000",
      endColor: "#8B0000",
      rotation: 180,
      children: [
        { name: "Enraged", children: ["Hateful", "Hostile"] },
        { name: "Exasperated", children: ["Agitated", "Frustrated"] },
        { name: "Irritable", children: ["Annoyed", "Aggravated"] },
        { name: "Jealous", children: ["Resentful", "Envious"] },
        { name: "Disgusted", children: ["Contemptuous", "Revolted"] },
      ],
    },
    {
      name: "Sadness",
      startColor: "#4682B4",
      endColor: "#00008B",
      rotation: 240,
      children: [
        { name: "Hurt", children: ["Agonized", "Disturbed"] },
        { name: "Unhappy", children: ["Miserable", "Disheartened"] },
        { name: "Disappointed", children: ["Dismayed", "Displeased"] },
        { name: "Shameful", children: ["Regretful", "Guilty"] },
        { name: "Lonely", children: ["Isolated", "Neglected"] },
        { name: "Gloomy", children: ["Hopeless", "Depressed"] },
      ],
    },
    {
      name: "Surprise",
      startColor: "#40E0D0",
      endColor: "#87CEFA",
      rotation: 300,
      children: [
        { name: "Stunned", children: ["Shocked", "Bewildered"] },
        { name: "Confused", children: ["Disillusioned", "Perplexed"] },
        { name: "Amazed", children: ["Astonished", "Awestruck"] },
        { name: "Overcome", children: ["Speechless", "Astounded"] },
        { name: "Moved", children: ["Stimulated", "Touched"] },
      ],
    },
  ] 