interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

const SectionTitle = ({ title, subtitle, centered = true }: SectionTitleProps) => {
  return (
    <div className={`mb-16 animate-fade-in ${centered ? "text-center" : ""}`}>
      <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
