import React from 'react';
import { Text, Linking } from 'react-native';

const DescriptionWithLinks = ({ description }) => {
    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Split the description text into an array of words and URLs
    const parts = description.split(urlRegex);

    return (
        <Text style={{ color: "#939393" }}>
            {parts.map((part, index) => {
                if (part.match(urlRegex)) {
                    // If the part is a URL, make it clickable
                    return (
                        <Text
                            key={index}
                            style={{ color: 'blue', textDecorationLine: 'underline' }}
                            onPress={() => Linking.openURL(part)}
                        >
                            {part}
                        </Text>
                    );
                }

                // If the part is a regular word, render it as is
                return part;
            })}
        </Text>
    );
};

export default DescriptionWithLinks;
