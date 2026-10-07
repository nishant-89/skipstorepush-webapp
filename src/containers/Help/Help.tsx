import { ChevronDown } from "lucide-react";
import Breadcrumbs from "src/components/common/BreadCrumbs/BreadCrumbs";
import DebounceSearch from "src/components/common/Search/Search";
import { useHelpHelper } from "./helper";
import "./help.scss";

const Help = () => {
  const {
    groups,
    emptyMessage,
    stillStuck,
    openIds,
    toggleFaq,
    searchTerm,
    setSearchTerm,
    onSearch,
  } = useHelpHelper();

  return (
    <div className="helpPage">
      <Breadcrumbs />
      <div className="cardBgWrapper helpCard">
        <DebounceSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearch={onSearch}
          placeholder="Search FAQs"
          alphanumericOnly={false}
        />
        {groups.length === 0 ? (
          <p className="emptyFaqs">
            {emptyMessage || "No FAQs are available right now."}
          </p>
        ) : (
          groups.map((group) => (
            <section className="faqGroup" key={group.id}>
              <h3>{group.title}</h3>
              {group.items.map((faq) => {
                const isOpen = openIds.includes(faq.id);
                const answerId = `faq-answer-${faq.id}`;
                return (
                  <article
                    key={faq.id}
                    className={`faqItem ${isOpen ? "open" : ""}`}
                  >
                    <button
                      type="button"
                      className="faqQuestion"
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <span className="faqQuestionText">{faq.question}</span>
                      <ChevronDown
                        size={18}
                        className="faqChevron"
                        aria-hidden
                      />
                    </button>
                    {isOpen ? (
                      <p className="faqAnswer" id={answerId}>
                        {faq.answer}
                      </p>
                    ) : null}
                  </article>
                );
              })}
            </section>
          ))
        )}
        {stillStuck?.message ? (
          <aside className="stillStuck">
            <p>{stillStuck.message}</p>
            <div className="stillStuckLinks">
              {stillStuck.docsUrl ? (
                <a href={stillStuck.docsUrl} target="_blank" rel="noreferrer">
                  Documentation
                </a>
              ) : null}
              {stillStuck.supportEmail ? (
                <a href={`mailto:${stillStuck.supportEmail}`}>
                  {stillStuck.supportEmail}
                </a>
              ) : null}
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
};

export default Help;
