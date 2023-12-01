import ReactionRoleEditor from '@comp/reactionRoles/ReactionRoleEditor';
import { GuildReactionRolesLoader, queryReactionRoles } from '@guild/reactionroles/Loader';
import usePages from '@hooks/usePages';
import { Accordion, Pagination, Tabs } from 'flowbite-react';
import { FC, useId, useState } from 'react';
import { BiCog } from 'react-icons/bi';
import { HiOutlineArrowCircleDown } from 'react-icons/hi';
import { useLoaderData, useParams } from 'react-router-dom';

const Component: FC = () => {
	const { guildId } = useParams();
	const Id = useId();
	const { messages, reactionRoles } = useLoaderData() as GuildReactionRolesLoader;

	const [cachedMessages, setCachedMessages] = useState(() => messages);
	const [ShowElements, TotalPage, page, setPage, setCommands] = usePages(() => reactionRoles, 10);

	const onUpdatePage = async () => {
		await queryReactionRoles(guildId!)
			.then((result) => {
				if (result) {
					setCommands(result.reactionRoles);
					setCachedMessages(result.messages);
				}
			})
			.catch(() => {});
	};

	return (
		<>
			<div className='mb-4 flex w-full flex-col rounded-lg border border-gray-200 bg-white p-0 shadow-md dark:border-gray-700 dark:bg-gray-800'>
				<div className='flex h-full flex-col justify-center gap-4 p-0'>
					<div className='flex flex-col gap-2'>
						<Tabs style='underline'>
							<Tabs.Item active={true} title='Settings' icon={BiCog}>
								<div className='p-2 px-4'>
									<ReactionRoleEditor onUpdate={onUpdatePage} />
								</div>
							</Tabs.Item>
						</Tabs>
					</div>
				</div>
			</div>

			{TotalPage > 1 && <Pagination currentPage={page} totalPages={TotalPage} onPageChange={setPage} className='mb-5 text-center' />}
			{ShowElements.length > 0 && (
				<Accordion collapseAll={true} arrowIcon={HiOutlineArrowCircleDown}>
					{ShowElements.map((reaction) => (
						<Accordion.Panel key={reaction._id}>
							<Accordion.Title>{cachedMessages[reaction.messageId]?.content?.substring(0, 25) + '...'}</Accordion.Title>
							<Accordion.Content>
								<ReactionRoleEditor modifyData={reaction} onUpdate={onUpdatePage} />
							</Accordion.Content>
						</Accordion.Panel>
					))}
				</Accordion>
			)}
		</>
	);
};

export { Component };
