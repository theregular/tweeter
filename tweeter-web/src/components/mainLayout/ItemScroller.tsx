import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfoListener from "../userInfo/UserInfoListenerHook";
import {
  PagedItemPresenter,
  PagedItemView,
} from "../../presenter/PagedItemPresenter";

interface Props<S, U extends PagedItemView<V>, V> {
  presenterGenerator: (view: PagedItemView<V>) => PagedItemPresenter<V, U, S>;
  itemComponentGenerator: (value: V) => JSX.Element;
}

const ItemScroller = <S, U extends PagedItemView<V>, V>(
  props: Props<S, U, V>
) => {
  const { displayErrorMessage } = useToastListener();
  const [items, setItems] = useState<V[]>([]);
  const [newItems, setNewItems] = useState<V[]>([]);
  const [changedDisplayedUser, setChangedDisplayedUser] = useState(true);

  const { displayedUser, authToken } = useUserInfoListener();

  // Initialize the component whenever the displayed user changes
  useEffect(() => {
    reset();
  }, [displayedUser]);

  // Load initial items whenever the displayed user changes. Done in a separate useEffect hook so the changes from reset will be visible.
  useEffect(() => {
    if (changedDisplayedUser) {
      loadMoreItems();
    }
  }, [changedDisplayedUser]);

  // Add new items whenever there are new items to add
  useEffect(() => {
    if (newItems) {
      setItems([...items, ...newItems]);
    }
  }, [newItems]);

  const listener: PagedItemView<V> = {
    addItems: (newItems: V[]) => setNewItems(newItems),
    displayErrorMessage: displayErrorMessage,
  };

  const [presenter] = useState(props.presenterGenerator(listener));

  const reset = async () => {
    setItems([]);
    setNewItems([]);
    presenter.reset();
    setChangedDisplayedUser(true);
  };

  const loadMoreItems = async () => {
    presenter.loadMoreItems(authToken!, displayedUser!.alias);
    setChangedDisplayedUser(false);
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={presenter.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            {props.itemComponentGenerator(item)}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default ItemScroller;
