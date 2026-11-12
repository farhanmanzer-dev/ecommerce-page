// Wraps every word in a mask + inner span so GSAP can slide words up from behind the mask.
export default function SplitWords({ text, className = "" }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(" ").map((word, i) => (
        <span className="word-mask" key={i} aria-hidden="true">
          <span className="word">{word}&nbsp;</span>
        </span>
      ))}
    </span>
  );
}
