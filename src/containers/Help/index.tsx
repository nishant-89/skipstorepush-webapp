import Breadcrumbs from "src/components/common/BreadCrumbs";
import DebounceSearch from "src/components/common/Search";
import { useHelpHelper } from "./helper";
import "./help.scss";

const Help = () => {
  const {
    groups,
    emptyMessage,
    stillStuck,
    openId,
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
              {group.items.map((faq) => (
                <button
                  type="button"
                  key={faq.id}
                  className={`faqItem ${openId === faq.id ? "open" : ""}`}
                  onClick={() => toggleFaq(faq.id)}
                >
                  <div className="faqQuestion">{faq.question}</div>
                  {openId === faq.id ? (
                    <p className="faqAnswer">{faq.answer}</p>
                  ) : null}
                </button>
              ))}
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
