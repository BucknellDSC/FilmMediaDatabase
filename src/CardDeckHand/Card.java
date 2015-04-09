/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package CardDeckHand;

/**
 *
 * @author justi_000
 */
public class Card {

    public enum Suite {

        Spades, Hearts, Clubs, Diamonds;
    }

    private Suite suite;
    private int value;

    public Card(Suite suite, int value) {
        this.suite = suite;
        this.value = value;
    }

    public Suite getSuite() {
        return suite;
    }

    public void setSuite(Suite suite) {
        this.suite = suite;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }

    /**
     * Basically a getter for value, but returns a string instead of an int, and
     * provides the jack, queen, king, and ace cards as a capital letter.
     *
     * @return The card value, as a string.
     */
    public String getStringValue() {
        if (this.value < 11) {
            return ("" + this.value);
        } else {
            if (this.value == 11) {
                return "J";
            } else if (this.value == 12) {
                return "Q";
            } else if (this.value == 13) {
                return "K";
            } else if (this.value == 15) {
                return "A";
            } else {
                return "error";
            }
        }
    }

}
