/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package TexasModel;

import java.util.ArrayList;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

/**
 *
 * @author huangjiayu
 */
public class GameModelTest {

    public Player play1;
    public Player play2;
    public Player play3;
    public GameModel gametest;

    public GameModelTest() {
    }

    @Before
    public void setUp() {
        play1 = new Player("Jerry");
        play2 = new Player("Justin");
        play3 = new Player("Jaspr");
        ArrayList<Player> play = new ArrayList<>();
        play.add(play1);

        play.add(play2);
        play.add(play3);
        gametest = new GameModel(100, play);

    }

    @After
    public void tearDown() {
    }

    /**
     * Test of giveCards method, of class GameModel.
     */
    @Test
    public void testGiveCards() throws Exception {
        gametest.giveCards();
        int cardnum = 2;
        for (Player p : gametest.getPlayers()) {
            Assert.assertEquals(p.getHand().getHand().size(), cardnum);
        }
    }

    @Test
    public void testNextPlayer() throws Exception {
        Player instance = gametest.getCurrentPlayer();
        Assert.assertEquals(instance, play1);
        gametest.nextPlayer();
        instance = gametest.getCurrentPlayer();
        Assert.assertEquals(instance, play2);
        gametest.nextPlayer();
        instance = gametest.getCurrentPlayer();
        Assert.assertEquals(instance, play3);
        gametest.nextPlayer();
        instance = gametest.getCurrentPlayer();
        Assert.assertEquals(instance, play1);
    }

    /**
     * Test of isAllCheck method, of class GameModel.
     */
    @Test
    public void testisAllCall() throws NoMoneyException, SixCardHandException {

        Player play1 = gametest.getPlayers().get(0);
        play1.setMoney(10000);
        Player play2 = gametest.getPlayers().get(1);
        play2.setMoney(10000);
        Player play3 = gametest.getPlayers().get(2);
        play3.setMoney(10000);
        play1.raise(100);
        play2.call();
        play3.call();
        //Current Player = play1
        gametest.getPlayerChoice();
        //Current Player = play2
        //Size of Player in the Round is 1
        Assert.assertEquals(gametest.isAllCall(), false);
        gametest.getPlayerChoice();
        //Size of Player in the Round is 0
        Assert.assertEquals(gametest.isAllCall(), false);
        gametest.getPlayerChoice();
        Assert.assertEquals(gametest.isIsFlop(), true);

    }
}

//    /**
//     * Test of addPlayer method, of class GameModel.
//     */
//    @Test
//    public void testAddPlayer() {
//        System.out.println("addPlayer");
//        Player a = null;
//        GameModel instance = null;
//        instance.addPlayer(a);
//    }
//
//    /**
//     * Test of nextTurn method, of class GameModel.
//     */
//    @Test
//    public void testNextTurn() throws Exception {
//        System.out.println("nextTurn");
//        GameModel instance = null;
//        instance.nextTurn();
//
//    }
//
//    /**
//     * Test of resetpool method, of class GameModel.
//     */
//    @Test
//    public void testResetpool() {
//        System.out.println("resetpool");
//        GameModel instance = null;
//        instance.resetpool();
//
//    }
//
//    /**
//     * Test of checkWin method, of class GameModel.
//     */
//    @Test
//    public void testCheckWin() throws Exception {
//        System.out.println("checkWin");
//        GameModel instance = null;
//        instance.checkWin();
//
//    }
//
//    /**
//     * Test of checkTie method, of class GameModel.
//     */
//    @Test
//    public void testCheckTie() {
//        System.out.println("checkTie");
//        GameModel instance = null;
//        int expResult = 0;
//        int result = instance.checkTie();
//
//    }
//
//    /**
//     * Test of getTheDeck method, of class GameModel.
//     */
//    /**
//     * Test of setMoneypool method, of class GameModel.
//     */
//    @Test
//    public void testSetMoneypool() {
//        System.out.println("setMoneypool");
//        double moneypool = 0.0;
//        GameModel instance = null;
//
//    }
//
//    /**
//     * Test of fold method, of class GameModel.
//     */
//    @Test
//    public void testFold() throws Exception {
//        System.out.println("fold");
//        GameModel instance = null;
//        instance.fold();
//        // TODO review the generated test code and remove the default call to fail.
//    }
//
//    /**
//     * Test of allIn method, of class GameModel.
//     */
//    @Test
//    public void testAllIn() throws Exception {
//        System.out.println("allIn");
//        GameModel instance = null;
//        instance.allIn();
//    }
//
//    /**
//     * Test of isIsBlind method, of class GameModel.
//     */
//    @Test
//    public void testIsIsBlind() {
//        System.out.println("isIsBlind");
//        boolean expResult = false;
//        boolean result = GameModel.isIsBlind();
//    }
//
//    /**
//     * Test of isIsTurnhand method, of class GameModel.
//     */
//    @Test
//    public void testIsIsTurnhand() {
//        System.out.println("isIsTurnhand");
//        boolean expResult = false;
//        boolean result = GameModel.isIsTurnhand();
//
//    }
//
//    /**
//     * Test of isIsRiverhand method, of class GameModel.
//     */
//    @Test
//    public void testIsIsRiverhand() {
//        System.out.println("isIsRiverhand");
//        boolean expResult = false;
//        boolean result = GameModel.isIsRiverhand();
//
//    }
//
//    /**
//     * Test of getPoolcards method, of class GameModel.
//     */
//    @Test
//    public void testGetPoolcards() {
//        System.out.println("getPoolcards");
//        GameModel instance = null;
//        ArrayList<Card> expResult = null;
//        ArrayList<Card> result = instance.getPoolcards();
//    }
//
//    /**
//     * Test of raise method, of class GameModel.
//     */
//    @Test
//    public void testRaise() throws Exception {
//        System.out.println("raise");
//        double amount = 0.0;
//        GameModel instance = null;
//        instance.raise(amount);
//    }
//
//    /**
//     * Test of call method, of class GameModel.
//     */
//    @Test
//    public void testCall() throws Exception {
//        System.out.println("call");
//        GameModel instance = null;
//        instance.call();
//
//    }
//
//    /**
//     * Test of check method, of class GameModel.
//     */
//    @Test
//    public void testCheck() throws Exception {
//        System.out.println("check");
//        GameModel instance = null;
//        instance.check();
//
//    }
//
//}
