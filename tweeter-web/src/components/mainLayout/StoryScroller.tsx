import StatusItemScroller from "./StatusItemScroller";
import { StoryPresenter } from "../../presenter/StoryPresenter";
import { StatusItemView } from "../../presenter/StatusItemPresenter";

const StoryScroller = () => {
  return (
    <>
      <StatusItemScroller
        presenterGenerator={(view: StatusItemView) => new StoryPresenter(view)}
      />
    </>
  );
};

export default StoryScroller;
