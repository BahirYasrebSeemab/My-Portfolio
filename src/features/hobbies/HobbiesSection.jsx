import "./styles/HobbiesSection.css";

// Placeholders — swap these for the real things you've built just for fun.
const hobbies = [
  {
    id: 1,
    title: "Placeholder Experiment #1",
    description: "// TODO: swap this with something you actually built for fun — a weekend hack, a weird tool, whatever it was.",
    tag: "WIP",
    link: null,
  },
  {
    id: 2,
    title: "Placeholder Experiment #2",
    description: "// TODO: another fun/throwaway project goes here.",
    tag: "WIP",
    link: null,
  },
  {
    id: 3,
    title: "Placeholder Experiment #3",
    description: "// TODO: a third one — or delete this card if you only end up with two.",
    tag: "WIP",
    link: null,
  },
];

const HobbiesSection = () => (
  <div className="hobbies-section">
    <div className="hobbies-content">
      <h2 className="hobbies-header">// hobbies-and-boredom</h2>
      <p className="hobbies-description">
        Stuff I've built just because I was bored — no roadmap, no clients, just curiosity.
      </p>
      <div className="hobbies-grid">
        {hobbies.map((hobby) => (
          <div key={hobby.id} className="hobby-card">
            <span className="hobby-tag">{hobby.tag}</span>
            <h3 className="hobby-title">{hobby.title}</h3>
            <p className="hobby-description">{hobby.description}</p>
            {hobby.link && (
              <a href={hobby.link} target="_blank" rel="noopener noreferrer" className="hobby-link">
                take a look →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default HobbiesSection;
