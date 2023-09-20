// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { useEffect, useState } from 'react';
import { Dropdown, MenuProps, Modal, Timeline, TimelineItemProps } from 'antd';
import CloseIcon from '~assets/icons/close.svg';
import { ICommentHistory } from '~src/types';
import styled from 'styled-components';
import NameLabel from './NameLabel';
import getRelativeCreatedAt from '~src/util/getRelativeCreatedAt';
import { AgainstIcon, ForIcon, NeutralIcon, SlightlyAgainstIcon, SlightlyForIcon } from './CustomIcons';
import { poppins } from 'pages/_app';
import UserAvatar from './UserAvatar';
import { diffChars } from 'diff';

interface Props {
	className?: string;
	open: boolean;
	setOpen: (pre: boolean) => void;
	history: ICommentHistory[];
	defaultAddress?: string | null;
	username?: string;
	user_id?: number;
}
interface IHistoryData extends ICommentHistory {
	expanded?: boolean;
}

const CommentHistoryModal = ({ className, open, setOpen, history, defaultAddress, username, user_id }: Props) => {
	const [historyData, setHistoryData] = useState<IHistoryData[]>(history);

	const items: TimelineItemProps[] = historyData?.map((item, index) => {
		const difference = historyData[index + 1] ? diffChars(historyData[index + 1]?.content, item?.content) : [];

		const items: MenuProps['items'] = [
			item?.sentiment === 1
				? {
						key: 1,
						label: <div className={`${poppins.variable} ${poppins.className} bg-pink-100 pl-1 pr-1 text-[10px] font-light leading-4 tracking-wide`}>Completely Against</div>
				  }
				: null,
			item?.sentiment === 2
				? { key: 2, label: <div className={`${poppins.variable} ${poppins.className} bg-pink-100 pl-1 pr-1 text-[10px] font-light leading-4 tracking-wide`}>Slightly Against</div> }
				: null,
			item?.sentiment === 3
				? { key: 3, label: <div className={`${poppins.variable} ${poppins.className} bg-pink-100 pl-1 pr-1 text-[10px] font-light leading-4 tracking-wide`}>Neutral</div> }
				: null,
			item?.sentiment === 4
				? { key: 4, label: <div className={`${poppins.variable} ${poppins.className} bg-pink-100 pl-1 pr-1 text-[10px] font-light leading-4 tracking-wide`}>Slightly For</div> }
				: null,
			item?.sentiment === 5
				? { key: 5, label: <div className={`${poppins.variable} ${poppins.className} bg-pink-100 pl-1 pr-1 text-[10px] font-light leading-4 tracking-wide`}>Completely For</div> }
				: null
		];

		return {
			children: (
				<div className={`ml-2 rounded-[4px] bg-[#FAFAFC] py-3 pl-3 pr-1 max-sm:ml-0 max-sm:w-full ${item?.expanded && 'active-timeline'} ${poppins.variable} ${poppins.className}`}>
					<div className='flex items-center justify-between'>
						<div className='flex items-center'>
							<NameLabel
								defaultAddress={defaultAddress}
								username={username}
								textClassName='text-[#334D6E] text-xs'
							/>
							<div className='flex items-center'>
								&nbsp;
								<div className='mr-2 mt-[1px] flex h-[3px] w-[3px] items-center justify-center rounded-full bg-[#A0A6AE]' />
								<div className='flex items-center'>
									<span className='text-[10px] text-navBlue'>{getRelativeCreatedAt(item?.created_at)}</span>
								</div>
							</div>
						</div>
						{item?.sentiment === 1 && (
							<Dropdown
								overlayClassName='sentiment-hover'
								placement='topCenter'
								menu={{ items }}
								className='flex items-center  justify-center text-lg text-white  min-[320px]:mr-2'
							>
								<AgainstIcon className='min-[320px]:items-start' />
							</Dropdown>
						)}
						{item?.sentiment === 2 && (
							<Dropdown
								overlayClassName='sentiment-hover'
								placement='topCenter'
								menu={{ items }}
								className='flex items-center  justify-center text-lg text-white min-[320px]:mr-2'
							>
								<SlightlyAgainstIcon className='min-[320px]:items-start' />
							</Dropdown>
						)}
						{item?.sentiment === 3 && (
							<Dropdown
								overlayClassName='sentiment-hover'
								placement='topCenter'
								menu={{ items }}
								className='flex items-center  justify-center text-lg text-white min-[320px]:mr-2'
							>
								<NeutralIcon className='min-[320px]:items-start' />
							</Dropdown>
						)}
						{item?.sentiment === 4 && (
							<Dropdown
								overlayClassName='sentiment-hover'
								placement='topCenter'
								menu={{ items }}
								className='flex items-center  justify-center text-lg text-white min-[320px]:mr-2'
							>
								<SlightlyForIcon className='min-[320px]:items-start' />
							</Dropdown>
						)}
						{item?.sentiment === 5 && (
							<Dropdown
								overlayClassName='sentiment-hover'
								placement='topCenter'
								menu={{ items }}
								className='mb-[-1px] mr-[-1px] mt-[-2px] flex items-center  justify-center text-[20px] text-white min-[320px]:mr-2'
							>
								<ForIcon className='min-[320px]:items-start' />
							</Dropdown>
						)}
					</div>
					<div
						className={`mt-2 px-[2px] text-sm font-normal text-[#243A57] ${!item?.expanded && item?.content.length > 100 && 'truncate-content'} tracking-[0.01em] ${
							poppins.className
						} ${poppins.variable} pr-2 leading-6`}
					>
						{historyData[index + 1] ? (
							<div>
								{difference?.map((text, idx) => (
									<span
										key={idx}
										className={`${text?.removed && 'bg-[#fff3b3]'} ${text?.added && 'bg-[#fff3b3]'}`}
									>
										{text.value}
									</span>
								))}
							</div>
						) : (
							item?.content
						)}
					</div>
					{item?.content.length > 100 && (
						<span
							onClick={() => handleExpand(index, !item?.expanded)}
							className='mt-1 cursor-pointer text-xs font-medium text-[#E5007A]'
						>
							{item?.expanded ? 'Show less' : 'Show more'}
						</span>
					)}
				</div>
			),
			dot: username && (
				<UserAvatar
					className='-mb-1 -mt-1 hidden flex-none sm:inline-block'
					username={username}
					size='large'
					id={user_id || 0}
				/>
			),
			key: index
		};
	});

	const handleExpand = (index: number, expanded: boolean) => {
		const data = historyData?.map((item, idx) => {
			if (idx === index) {
				return { ...item, expanded: expanded };
			}
			return item;
		});
		setHistoryData(data);
	};

	useEffect(() => {
		setHistoryData(history);
	}, [history, open]);

	return (
		<Modal
			open={open}
			onCancel={() => setOpen(false)}
			wrapClassName={className}
			className={`closeIcon ${poppins.variable} ${poppins.className} shadow-[0px 8px 18px rgba(0, 0, 0, 0.06)] w-[600px] max-sm:w-full`}
			footer={false}
			closeIcon={<CloseIcon />}
			title={<label className='-mt-2 pr-3 text-[20px] font-semibold text-[#334D6E] '>Comment Edit History</label>}
		>
			<div className='post-history-timeline -mb-5 mt-9 flex flex-col px-4'>
				<Timeline items={items} />
			</div>
		</Modal>
	);
};
export default styled(CommentHistoryModal)`
	.closeIcon .ant-modal-close-x {
		margin-top: 4px;
	}
	.truncate-content {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		width: 100%;
		overflow: hidden;
	}
	.post-history-timeline .ant-timeline-item {
		padding-bottom: 30px !important;
	}
	.post-history-timeline .ant-timeline-item-content {
		inset-block-start: -13px !important;
	}

	.post-history-timeline .ant-timeline .ant-timeline-item-tail {
		border-inline-start: 2px solid rgba(5, 5, 5, 0) !important;
		background-image: linear-gradient(rgba(144, 160, 183) 33%, rgba(255, 255, 255) 0%) !important;
		background-position: right !important;
		background-size: 1.5px 7px !important;
		background-repeat: repeat-y !important ;
	}

	.post-history-timeline .ant-timeline .ant-timeline-item:has(.active-timeline) {
		.ant-timeline-item-tail {
			background-image: linear-gradient(rgba(229, 0, 122) 33%, rgba(255, 255, 255) 0%) !important;
			background-position: right !important;
			background-size: 1.5px 7px !important;
			background-repeat: repeat-y !important ;
		}
	}
	@media screen and (max-width: 640px) {
		.post-history-timeline .ant-timeline .ant-timeline-item-tail {
			border: none !important;
		}
		.post-history-timeline .ant-timeline .ant-timeline-item-content {
			margin-left: 0px !important;
		}
	}
`;
