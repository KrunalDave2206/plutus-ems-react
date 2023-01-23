import React, { useState } from 'react';
import { Pagination } from "react-bootstrap";

import './pagination.scss';

export const PaginationComp = (props) => {
    const [selected, setSelected] = useState(1);
    const pages = props.pages || Math.ceil(props.records / props.pageSize) || 1;;
    let fstart = selected - 4 <= 0 ? 1 : selected - 4;
    let send = selected + 4 > pages ? pages : selected + 4;
    const onPageChange = (pgno) => { setSelected(pgno); if (props.onChange) props.onChange(pgno) }
    return (
        <Pagination className={props.alignment}>
            <Pagination.First disabled={selected == 1} onClick={() => onPageChange(1)} />
            <Pagination.Prev disabled={selected == 1} onClick={() => onPageChange(selected - 1)} />
            {fstart > 1 && <Pagination.Ellipsis />}
            {pageSteps(fstart, selected, onPageChange)}
            <Pagination.Item key={selected} active>{selected}</Pagination.Item>
            {pageSteps(selected + 1, send + 1, onPageChange)}
            {send < pages && <Pagination.Ellipsis />}
            <Pagination.Next disabled={selected == pages} onClick={() => onPageChange(selected + 1)} />
            <Pagination.Last disabled={selected == pages} onClick={() => onPageChange(pages)} />
        </Pagination>
    )
}

const pageSteps = (start, end, onClick) => {
    let pageItem = [];
    for (let i = start; i < end; i++)
        pageItem.push(<Pagination.Item key={i} onClick={() => onClick(i)} >{i}</Pagination.Item>)
    return pageItem;
}