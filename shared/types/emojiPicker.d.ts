export interface EmojiCategory {
	id : number,
	name : string
}


export interface Emoji {
	emoji : string,
	unicode : string,
	version : string,
	name : string
}

export interface EmojiSubCategory extends EmojiCategory {
	emojis : Emoji[];
}

export interface EmojiMainCategory extends EmojiCategory {
	subcats : EmojiSubCategory[];
}