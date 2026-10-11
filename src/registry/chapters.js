import { renderColdopen } from "../chapters/01-coldopen/Coldopen.js";
import { narrations as coldopenNarrations } from "../chapters/01-coldopen/narrations.js";
import { academicChapterSpecs, createAcademicChapter } from "../chapters/academic/AcademicChapters.js";

export const chapters = [
  {
    id: "coldopen",
    title: "水在本地，账跑全国",
    render: renderColdopen,
    narrations: coldopenNarrations,
  },
  ...academicChapterSpecs.map(createAcademicChapter),
];
