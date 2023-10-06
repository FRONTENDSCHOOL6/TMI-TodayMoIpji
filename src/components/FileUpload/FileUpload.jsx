import pb from '@/api/pocketbase';
import useStorage from '@/hooks/useStorage';
import { getNextSlideIndex, getPreviousSlideIndex } from '@/utils';
import debounce from '@/utils/debounce';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import MoveSlide from '../MoveSlide/MoveSlide';
import S from './FileUpload.module.css';
import photoIcon from '/photoIcon.svg';

function FileUpload() {
  const navigate = useNavigate();
  const { storageData } = useStorage('pocketbase_auth');
  const authUser = storageData?.model;

  const [isShowOptions, setIsShowOptions] = useState(true);
  const [selectedOption, setSelectedOption] = useState('');

  const toggleOptions = () => {
    setIsShowOptions(!isShowOptions);
  };
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    setIsShowOptions(true);
  };

  const contentRef = useRef(null);
  const [content, setContent] = useState('');

  const formRef = useRef(null);
  const photoRef = useRef(null);

  /* 게시물 업로드  --------------------------------------------------------------------- */

  const handlePost = async (e) => {
    e.preventDefault();
    const statusValue = selectedOption;
    const contentValue = contentRef.current.value;
    const photoValue = photoRef.current.files;

    if (
      photoValue.length === 0 ||
      contentRef.current.value.trim().length === 0
    ) {
      toast.error('사진과 내용을 입력해주세요', {
        ariaProps: {
          role: 'status',
          'aria-live': 'polite',
        },
      });
      return;
    }

    const formData = new FormData();

    formData.append('statusEmoji', statusValue);
    formData.append('content', contentValue);
    formData.append('user', authUser.id);
    if (photoValue) {
      for (let i = 0; i < photoValue.length; i++) {
        formData.append('photo', photoValue[i]);
      }
    }

    try {
      await pb.collection('posts').create(formData);
      toast.success('게시물이 성공적으로 올라갔습니다', {
        ariaProps: {
          role: 'status',
          'aria-live': 'polite',
        },
      });
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };
  /* 페이지 이동 버튼 --------------------------------------------------------------------- */
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNextSlide = () => {
    setCurrentIndex(getNextSlideIndex(currentIndex, fileImages));
  };

  const handelPrevSlide = () => {
    setCurrentIndex(getPreviousSlideIndex(currentIndex, fileImages));
  };

  const [fileImages, setFileImages] = useState([]);

  const handleUpload = (e) => {
    const { files } = e.target;
    const fileImages = Array.from(files).map((file) => ({
      image: URL.createObjectURL(file),
      label: file.name,
    }));
    setFileImages(fileImages);
  };

  const handleContent = debounce((e) => {
    const { value } = e.target;
    setContent(value);
  });

  return (
    <>
      <form
        encType="multipart/form-data"
        ref={formRef}
        onSubmit={handlePost}
        className={S.formWrapper}
      >
        {/* 이모지 선택 */}
        <div className={S.selectEmojiWrapper}>
          <button
            type="button"
            className={S.speechBubbleBody}
            onClick={toggleOptions}
          >
            <div className={S.speechBubbleHead}></div>
            {isShowOptions && (
              <div title="상태 선택"> {selectedOption || '상태 선택'}</div>
            )}
          </button>
          {!isShowOptions && (
            <ul className={S.statusListWrapper}>
              <li>
                <label aria-description="추워요" className="relative">
                  <input
                    type="radio"
                    name="options"
                    value="🥶"
                    className={S.selectEmoji}
                    onChange={handleOptionChange}
                    checked={selectedOption === '🥶'}
                  />
                  <span className={S.statusItem}>🥶</span>
                </label>
              </li>
              <li>
                <label aria-description="더워요" className="relative">
                  <input
                    type="radio"
                    name="options"
                    value="🥵"
                    className={S.selectEmoji}
                    onChange={handleOptionChange}
                    checked={selectedOption === '🥵'}
                  />
                  <span className={S.statusItem}>🥵</span>
                </label>
              </li>
              <li>
                <label aria-description="딱 좋아요" className="relative">
                  <input
                    type="radio"
                    name="options"
                    value="😌"
                    className={S.selectEmoji}
                    onChange={handleOptionChange}
                    checked={selectedOption === '😌'}
                  />
                  <span className={S.statusItem}>😌</span>
                </label>
              </li>
            </ul>
          )}
        </div>
        {/* 사진 업로드 */}
        <div className={S.photoContainer}>
          <label htmlFor="photo" className="sr-only">
            사진 업로드
          </label>
          <div className="relative">
            <input
              type="file"
              accept="*.jpg,*.png,*.jpeg,*.webp,*.avif"
              ref={photoRef}
              name="photo"
              id="photo"
              onChange={handleUpload}
              className={S.photo}
              multiple
            />
            <div className="carouselContainer">
              {fileImages.length ? (
                <div className={S.carouselWrapper}>
                  {fileImages.map((file, index) => (
                    <div
                      key={index}
                      className={`${index === currentIndex ? '' : 'hidden'}`}
                    >
                      <img
                        src={file.image}
                        alt={file.label}
                        className={S.uploadImage}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className={S.uploadBefore}>
                  <img src={photoIcon} alt="업로드" className="h-8 w-8" />
                </div>
              )}
            </div>
            <MoveSlide
              prevFunc={handelPrevSlide}
              nextFunc={handleNextSlide}
              disabled={fileImages.length <= 1 ? true : false}
            />
          </div>
        </div>
        {/* textarea */}
        <div className={S.textareaWrapper}>
          <label htmlFor="content" className="sr-only">
            message
          </label>
          <textarea
            name="content"
            id="content"
            cols="30"
            rows="10"
            ref={contentRef}
            maxLength={150}
            placeholder="텍스트를 입력하세요. (0 / 150)"
            className={S.textarea}
            defaultValue={content}
            onChange={handleContent}
          ></textarea>
        </div>
        <div className={S.postBtnWrapper}>
          <button type="submit" className={S.postBtn}>
            게시
          </button>
        </div>
      </form>
    </>
  );
}

export default FileUpload;
