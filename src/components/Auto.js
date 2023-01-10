import React, { useState, useEffect, useRef } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

function AutoComplete({ names }) {
	const [inputVal, setInputVal] = useState("");
	const [showList, setShowList] = useState(false);

	let inputRef = useRef();

	useEffect(() => {
		if (showList) {
			document.addEventListener("click", handleOutsideClick);
		} else {
			console.log("Removing Autocomplete listener on update!");
			document.removeEventListener("click", handleOutsideClick);
		}
	}, [showList]);

	useEffect(() => {
		return () => {
			console.log("Cleaning up event listener from Autocomplete!");
			document.removeEventListener("click", handleOutsideClick);
		};
	}, []);

	const handleInput = e => {
		setInputVal(e.target.value);
	};

	const selectName = ({ target: { innerText: name } }) => {
		setInputVal(name);
		setShowList(false);
	};

	const handleAutocompleteSectionClick = ({ target }) => {
		if (!target.classList.contains("nameLi")) {
			inputRef.current.focus();
		}
	};

	const handleOutsideClick = () => {
		if (document.activeElement === inputRef.current) return;
		else setShowList(false);
	};

	const matches = () => {
		const inputLength = inputVal.length;
		const matches = [];

		if (inputLength === 0) return names;

		names.forEach(name => {
			const nameSegment = name.slice(0, inputLength);
			if (nameSegment.toLowerCase() === inputVal.toLowerCase()) {
				matches.push(name);
			}
		});

		if (matches.length === 0) matches.push("No matches");

		console.log(matches.length);
		return matches;
	};

	const results = matches(names).map(result => {
		const nodeRef = React.createRef();
		return (
			<CSSTransition
				nodeRef={nodeRef}
				key={result}
				classNames="result"
				timeout={{ enter: 500, exit: 300 }}
			>
				<li ref={nodeRef} className="nameLi" onClick={selectName}>
					{result}
				</li>
			</CSSTransition>
		);
	});

	return (
		<section
			className="autocomplete-section"
			onClick={handleAutocompleteSectionClick}
		>
			<h1>Autocomplete</h1>
			<div className="auto">
				<input
					placeholder="Search..."
					ref={inputRef}
					onChange={handleInput}
					value={inputVal}
					onFocus={() => setShowList(true)}
				/>
				{showList && (
					<ul className="auto-dropdown">
						<TransitionGroup>{results}</TransitionGroup>
					</ul>
				)}
			</div>
		</section>
	);
}

export default AutoComplete;
