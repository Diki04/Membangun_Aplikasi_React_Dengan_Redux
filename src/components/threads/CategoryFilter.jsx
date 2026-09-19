import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCategory } from '../../store/threadsSlice';
import { selectAllCategories } from '../../store/threadsSlice';

function CategoryFilter() {
  const dispatch = useDispatch();
  const categories = useSelector(selectAllCategories);
  const selected = useSelector((state) => state.threads.selectedCategory);

  const handleSelect = (cat) => {
    dispatch(setCategory(cat === selected ? '' : cat));
  };

  if (categories.length === 0) return null;

  return (
    <div className="category-filter">
      <span className="filter-label">Filter Kategori:</span>
      <div className="filter-chips">
        <button
          type="button"
          className={`filter-chip ${!selected ? 'filter-chip-active' : ''}`}
          onClick={() => dispatch(setCategory(''))}
        >
          Semua
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`filter-chip ${selected === cat ? 'filter-chip-active' : ''}`}
            onClick={() => handleSelect(cat)}
          >
            #{cat}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;
