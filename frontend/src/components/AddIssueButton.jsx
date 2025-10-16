import { Link } from "react-router-dom";

const AddIssueButton = () => (
  <Link
    to="/create"
    className="fixed bottom-8 right-8 flex items-center justify-center size-16 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-300 z-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-background-dark"
    aria-label="Report a new issue"
  >
    <span className="material-symbols-outlined text-4xl">add</span>
  </Link>
);

export default AddIssueButton;
