type InstructorCharacterProps = {
  isSpeaking: boolean;
};

export function InstructorCharacter({ isSpeaking }: InstructorCharacterProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`instructor-scene relative ${isSpeaking ? "instructor-scene--speaking" : ""}`}
        aria-hidden
      >
        {/* 影 */}
        <div className="instructor-shadow" />

        {/* 本体 */}
        <div className={`instructor-body ${isSpeaking ? "instructor-body--speaking" : ""}`}>
          {/* 帽子 */}
          <div className="instructor-cap">
            <div className="instructor-cap__band" />
            <div className="instructor-cap__badge" />
          </div>

          {/* 顔 */}
          <div className="instructor-head">
            <div className="instructor-face">
              <div className="instructor-eyes">
                <div className="instructor-eye instructor-eye--left" />
                <div className="instructor-eye instructor-eye--right" />
              </div>
              <div
                className={`instructor-mouth ${isSpeaking ? "instructor-mouth--speaking" : ""}`}
              />
            </div>
          </div>

          {/* 制服 */}
          <div className="instructor-uniform">
            <div className="instructor-collar" />
            <div className="instructor-rank">
              <span />
              <span />
              <span />
            </div>
            <div className={`instructor-arm instructor-arm--left ${isSpeaking ? "instructor-arm--speaking" : ""}`} />
            <div className={`instructor-arm instructor-arm--right ${isSpeaking ? "instructor-arm--speaking" : ""}`} />
          </div>

          {/* 脚 */}
          <div className="instructor-legs">
            <div className="instructor-leg instructor-leg--left" />
            <div className="instructor-leg instructor-leg--right" />
          </div>
        </div>
      </div>

      <div className="mt-4 border border-[#3d6b3d] bg-[#0d1a0d]/90 px-3 py-2 text-center">
        <p className="text-[9px] font-bold tracking-[0.25em] text-[#4a7c4a]">
          一等陸曹
        </p>
        <p className="text-xs font-black tracking-wider text-[#a8c4a0]">
          田中 教官
        </p>
      </div>
    </div>
  );
}
