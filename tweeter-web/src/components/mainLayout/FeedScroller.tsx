import StatusItemScroller from "./StatusItemScroller";
import { FeedPresenter } from "../../presenter/FeedPresenter";
import { StatusItemView } from "../../presenter/StatusItemPresenter";

const FeedScroller = () => {
  return (
    <>
      <StatusItemScroller
        presenterGenerator={(view: StatusItemView) => new FeedPresenter(view)}
      />
    </>
  );
};

export default FeedScroller;
