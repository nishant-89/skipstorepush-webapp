import { useCallback, useEffect, useState } from "react";
import { getDataApi } from "src/apis/api";
import { setLoading } from "src/redux/slices/globalSlice";
import { useDispatch } from "react-redux";
import { apiRoutes, getErrorMessage } from "src/utils/common/constants";
import { FaqData, FaqGroup, FaqResponse, FaqStillStuck } from "../redux/types";
import { showAlert } from "src/utils/alert";

const emptyFaqData: FaqData = {
  groups: [],
  search: "",
  totalItems: 0,
  isEmpty: true,
  emptyMessage: "No FAQs are available right now.",
  stillStuck: {
    message: "",
    docsUrl: "",
    supportEmail: "",
  },
};

export const useHelpHelper = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [groups, setGroups] = useState<FaqGroup[]>([]);
  const [emptyMessage, setEmptyMessage] = useState<string | null>(null);
  const [stillStuck, setStillStuck] = useState<FaqStillStuck | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const loadFaqs = useCallback(
    async (search: string) => {
      try {
        dispatch(setLoading(true));
        const response = (await getDataApi({
          path: apiRoutes.Faqs,
          data: search ? { search } : {},
        })) as FaqResponse;

        if (response?.success) {
          const payload = response.data || emptyFaqData;
          setGroups(payload.groups || []);
          setEmptyMessage(payload.emptyMessage);
          setStillStuck(payload.stillStuck || null);
        }
      } catch (error) {
        showAlert(2, getErrorMessage(error));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    loadFaqs(searchQuery);
  }, [loadFaqs, searchQuery]);

  const toggleFaq = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return {
    groups,
    emptyMessage,
    stillStuck,
    openId,
    toggleFaq,
    searchTerm,
    setSearchTerm,
    onSearch: setSearchQuery,
  };
};
