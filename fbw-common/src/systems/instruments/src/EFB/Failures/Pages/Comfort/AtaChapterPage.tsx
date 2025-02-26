// Copyright (c) 2023-2024 FlyByWire Simulations
// SPDX-License-Identifier: GPL-3.0

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'react-bootstrap-icons';
import { AtaChapterNumber, AtaChaptersTitle, Failure } from '@flybywiresim/fbw-sdk';
import { t } from '../../../Localization/translation';
import { FailureButton } from '../../FailureButton';
import { useFailuresOrchestrator } from '../../../failures-orchestrator-provider';
import { ScrollableContainer } from '../../../UtilComponents/ScrollableContainer';
import { useAppSelector } from '../../../Store/store';

interface AtaChapterPageProps {
  chapter: AtaChapterNumber;
  failures: Failure[];
}

export const AtaChapterPage = ({ chapter, failures }: AtaChapterPageProps) => {
  const { activeFailures, changingFailures, activate, deactivate } = useFailuresOrchestrator();
  const { searchQuery } = useAppSelector((state) => state.failuresPage);
  const filteredFailures = failures.filter((failure) => failure.ata === chapter);

  const handleFailureButtonClick = (failureIdentifier: number) => {
    if (!activeFailures.has(failureIdentifier)) {
      activate(failureIdentifier);
    } else {
      deactivate(failureIdentifier);
    }
  };

  const getHighlightedTerm = (failureName: string) => {
    const searchQueryIdx = failureName.toUpperCase().indexOf(searchQuery);

    if (searchQuery === '' || searchQueryIdx === -1) return undefined;

    return failureName.substring(searchQueryIdx, searchQueryIdx + searchQuery.length);
  };

  return (
    <div>
      <Link to="/failures/comfort" className="inline-block">
        <div className="hover:text-theme-highlight flex flex-row items-center space-x-3 transition duration-100">
          <ArrowLeft size={30} />
          <h1 className="font-bold text-current">
            {t('Failures.Title')}
            {' > '}
            {AtaChaptersTitle[chapter]}
          </h1>
        </div>
      </Link>

      {filteredFailures.length === 0 ? (
        <div
          className="border-theme-accent mt-4 flex items-center justify-center rounded-md border-2"
          style={{ height: '44.5rem' }}
        >
          <p>{t('Failures.NoItemsFound')}</p>
        </div>
      ) : (
        <div
          className="h-content-section-reduced border-theme-accent mt-4 rounded-lg border-2 p-4"
          style={{ height: '44.5rem' }}
        >
          <ScrollableContainer innerClassName="grid grid-cols-4 auto-rows-auto" height={44}>
            {filteredFailures.map((failure, index) => (
              <FailureButton
                name={failure.name}
                isActive={activeFailures.has(failure.identifier)}
                isChanging={changingFailures.has(failure.identifier)}
                highlightedTerm={getHighlightedTerm(failure.name)}
                onClick={() => handleFailureButtonClick(failure.identifier)}
                className={`${index && index % 4 !== 0 && 'ml-4'} ${index >= 4 && 'mt-4'} h-36`}
              />
            ))}
          </ScrollableContainer>
        </div>
      )}
    </div>
  );
};
